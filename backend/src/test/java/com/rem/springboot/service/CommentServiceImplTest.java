package com.rem.springboot.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.rem.springboot.dto.CommentDto;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Comment;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CommentNotFoundException;
import com.rem.springboot.exception.PostNotFoundException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.CommentCreateRequest;
import com.rem.springboot.payload.request.CommentReadCondition;
import com.rem.springboot.repository.CommentRepository;
import com.rem.springboot.repository.PostRepository;
import com.rem.springboot.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {
  @InjectMocks
  CommentServiceImpl commentService;

  @Mock
  CommentRepository commentRepository;

  @Mock
  UserRepository userRepository;

  @Mock
  PostRepository postRepository;

  @Test
  void createTest() {
    // given
    User user = new User("user@email.com", "123456a!", "nickname", List.of());
    given(userRepository.findById(anyLong())).willReturn(Optional.of(user));
    given(postRepository.findById(anyLong())).willReturn(
        Optional.of(new Post("title", "content", user, new Category("category", null), List.of())));

    // when
    commentService.create(new CommentCreateRequest("content", 1L, 1L, null));

    // then
    verify(commentRepository).save(any());
  }

  @Test
  void createExceptionByUserNotFoundTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> commentService.create(new CommentCreateRequest("content", 1L, 1L, null)))
    .isInstanceOf(UserNotFoundException.class);
  }

  @Test
  void createExceptionByPostNotFoundTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(Optional.of(new User("user@email.com", "123456a!", "nickname", List.of())));
    given(postRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> commentService.create(new CommentCreateRequest("content", 1L, 1L, null)))
    .isInstanceOf(PostNotFoundException.class);
  }

  @Test
  void createExceptionByCommentNotFoundTest() {
    // given
    User user = new User("user@email.com", "123456a!", "nickname", List.of());
    given(userRepository.findById(anyLong())).willReturn(Optional.of(user));
    given(postRepository.findById(anyLong())).willReturn(
        Optional.of(new Post("title", "content", user, new Category("category", null), List.of())));
    given(commentRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> commentService.create(new CommentCreateRequest("content", 1L, 1L, 1L)))
    .isInstanceOf(CommentNotFoundException.class);
  }

  @Test
  void readAllTest() {
    // given
    User user = new User("user@email.com", "123456a!", "nickname", List.of());
    Post post = new Post("title", "content", user, new Category("category", null), List.of());
    given(commentRepository.findAllWithUserAndParentByPostIdOrderByParentIdAscNullsFirstCommentIdAsc(anyLong()))
    .willReturn(List.of(new Comment("content1", user, post, null), new Comment("content2", user, post, null)));

    // when
    List<CommentDto> result = commentService.readAll(new CommentReadCondition(1L));

    // then
    assertThat(result.size()).isEqualTo(2);
  }

  @Test
  void readAllDeletedComment() {
    // given
    User user = new User("user@email.com", "123456a!", "nickname", List.of());
    Post post = new Post("title", "content", user, new Category("category", null), List.of());
    Comment deletedComment1 = new Comment("content1", user, post, null);
    Comment deletedComment2 = new Comment("content2", user, post, null);
    deletedComment1.delete();
    deletedComment2.delete();
    given(commentRepository.findAllWithUserAndParentByPostIdOrderByParentIdAscNullsFirstCommentIdAsc(anyLong()))
    .willReturn(List.of(deletedComment1, deletedComment2));

    // when
    List<CommentDto> result = commentService.readAll(new CommentReadCondition(1L));

    // then
    assertThat(result.size()).isEqualTo(2);
    assertThat(result.get(0).getContent()).isNull();
    assertThat(result.get(0).getUser()).isNull();
  }
}
