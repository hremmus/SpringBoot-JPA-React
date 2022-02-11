package com.rem.springboot.service;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Image;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CategoryNotFoundException;
import com.rem.springboot.exception.UnsupportedFileFormatException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.PostCreateRequest;
import com.rem.springboot.repository.CategoryRepository;
import com.rem.springboot.repository.PostRepository;
import com.rem.springboot.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PostServiceImplTest {
  @InjectMocks
  PostServiceImpl postService;

  @Mock
  PostRepository postRepository;

  @Mock
  UserRepository userRepository;

  @Mock
  CategoryRepository categoryRepository;

  @Mock
  FileService fileService;

  @Test
  void createTest() {
    // given
    PostCreateRequest request = new PostCreateRequest("title", "content", 1L, 1L,
        List.of(
            new MockMultipartFile("test1", "test1.PNG", MediaType.IMAGE_PNG_VALUE, "test1".getBytes()),
            new MockMultipartFile("test2", "test2.PNG", MediaType.IMAGE_PNG_VALUE, "test2".getBytes())));

    given(userRepository.findById(anyLong())).willReturn(Optional.of(new User("user@email.com", "password", "nickname", List.of())));
    given(categoryRepository.findById(anyLong())).willReturn(Optional.of(new Category("name", null)));
    given(postRepository.save(any())).willReturn(
        new Post("title", "content", new User("user@email.com", "password", "nickname", List.of()),
            new Category("name", null), IntStream.range(0, request.getImages().size())
            .mapToObj(i -> new Image("origin_filename.jpg")).collect(toList())));

    // when
    postService.create(request);

    // then
    verify(postRepository).save(any());
    verify(fileService, times(request.getImages().size())).upload(any(), anyString());
  }

  @Test
  void createExceptionByUserNotFoundTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(Optional.ofNullable(null));

    // when, then
    assertThatThrownBy(() -> postService.create(new PostCreateRequest("title", "content", 1L, 1L,
        List.of(
            new MockMultipartFile("test1", "test1.PNG", MediaType.IMAGE_PNG_VALUE, "test1".getBytes()),
            new MockMultipartFile("test2", "test2.PNG", MediaType.IMAGE_PNG_VALUE, "test2".getBytes())
            )))).isInstanceOf(UserNotFoundException.class);
  }

  @Test
  void createExceptionByCategoryNotFoundTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(Optional.of(
        new User("user@email.com", "password", "nickname", List.of())));
    given(categoryRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> postService.create(new PostCreateRequest("title", "content", 1L, 1L,
        List.of(
            new MockMultipartFile("test1", "test1.PNG", MediaType.IMAGE_PNG_VALUE, "test1".getBytes()),
            new MockMultipartFile("test2", "test2.PNG", MediaType.IMAGE_PNG_VALUE, "test2".getBytes()))
        ))).isInstanceOf(CategoryNotFoundException.class);
  }

  @Test
  void createExceptionByUnsupportedFileFormatExceptionTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(Optional.of(new User("user@email.com", "password", "nickname", List.of())));
    given(categoryRepository.findById(anyLong())).willReturn(Optional.of(new Category("name", null)));

    // when, then
    assertThatThrownBy(() -> postService.create(new PostCreateRequest("title", "content", 1L, 1L,
        List.of(new MockMultipartFile("test", "test.txt", MediaType.TEXT_PLAIN_VALUE, "test".getBytes())))))
    .isInstanceOf(UnsupportedFileFormatException.class);
  }
}
