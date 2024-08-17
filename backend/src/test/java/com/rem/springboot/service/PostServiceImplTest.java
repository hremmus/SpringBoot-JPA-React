package com.rem.springboot.service;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
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
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import com.rem.springboot.dto.PostDto;
import com.rem.springboot.dto.PostListDto;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Image;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CategoryNotFoundException;
import com.rem.springboot.exception.PostNotFoundException;
import com.rem.springboot.exception.UnsupportedFileFormatException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.PostCreateRequest;
import com.rem.springboot.payload.request.PostUpdateRequest;
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
  SimpleStorageServiceImpl s3Service;

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
    verify(s3Service, times(request.getImages().size())).upload(any(), anyString());
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

  @Test
  void readAllTest() {
    // given
    given(postRepository.findAllByCondition(any())).willReturn(Page.empty());

    // when
    PostListDto postListDto = postService.readAll(new PostReadCondition(1, 1, List.of(), List.of()));

    // then
    assertThat(postListDto.getPosts().size()).isZero();
  }

  @Test
  void readTest() {
    // given
    Post post = new Post("title", "content", new User("user@email.com", "password", "nickname", List.of()),
        new Category("name", null),
        List.of(new Image("origin_filename1.jpg"), new Image("origin_filename2.jpg")));
    given(postRepository.findById(anyLong())).willReturn(Optional.of(post));

    // when
    PostDto postDto = postService.read(1L);

    // then
    assertThat(postDto.getTitle()).isEqualTo(post.getTitle());
    assertThat(postDto.getImages().size()).isEqualTo(post.getImages().size());
  }

  @Test
  void readExceptionByPostNotFoundTest() {
    // given
    given(postRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> postService.read(1L)).isInstanceOf(PostNotFoundException.class);
  }

  @Test
  void updateTest() {
    // given
    Image a = new Image("a.png");
    ReflectionTestUtils.setField(a, "id", 1L);
    Image b = new Image("b.jpg");
    ReflectionTestUtils.setField(b, "id", 2L);
    Post post = new Post("title", "content", new User("user@email.com", "password", "nickname", List.of()),
        new Category("name", null), List.of(a, b));
    given(postRepository.findById(anyLong())).willReturn(Optional.of(post));
    given(categoryRepository.findById(anyLong())).willReturn(Optional.of(new Category("name", null)));
    MockMultipartFile cFile = new MockMultipartFile("c", "c.png", MediaType.IMAGE_PNG_VALUE, "c".getBytes());

    PostUpdateRequest request = new PostUpdateRequest("title", "content", 1L, List.of(cFile), List.of(a.getId()));

    // when
    postService.update(1L, request);

    // then
    List<Image> images = post.getImages();
    List<String> originNames = images.stream().map(i -> i.getOriginName()).collect(toList());
    assertThat(images.size()).isEqualTo(2);
    assertThat(originNames).contains(b.getOriginName(), cFile.getOriginalFilename());

    verify(s3Service, times(1)).upload(any(), anyString());
    verify(s3Service, times(1)).delete(anyString());
  }

  @Test
  void updateExceptionByPostNotFoundTest() {
    // given
    given(postRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> postService.update(1L, new PostUpdateRequest("title", "content", 1L, List.of(), List.of())))
    .isInstanceOf(PostNotFoundException.class);
  }

  @Test
  void deleteTest() {
    // given
    Image a = new Image("a.png");
    ReflectionTestUtils.setField(a, "id", 1L);
    Image b = new Image("b.jpg");
    ReflectionTestUtils.setField(b, "id", 2L);
    Post post = new Post("title", "content", new User("user@email.com", "password", "nickname", List.of()),
        new Category("name", null), List.of(a, b));
    given(postRepository.findById(anyLong())).willReturn(Optional.of(post));

    // when
    postService.delete(1L);

    // then
    verify(s3Service, times(post.getImages().size())).delete(anyString());
    verify(postRepository).delete(any());
  }

  @Test
  void deleteExceptionByNotFoundPostTest() {
    // given
    given(postRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> postService.delete(1L)).isInstanceOf(PostNotFoundException.class);
  }
}
