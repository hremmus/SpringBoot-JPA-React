package com.rem.springboot.entity;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class CommentTest {
  User user;
  Category category;
  Post post;

  @BeforeEach
  void beforeEach() {
    user = new User("user@eamil.com", "123456a!", "nickname", List.of());
    category = new Category("category1", null);
    post = new Post("title", "content", user, category, List.of());
  }

  @Test
  void deleteTest() {
    // given
    Comment comment = new Comment("content", user, post, null);
    boolean beforeDeleted = comment.isDeleted();

    // when
    comment.delete();
    boolean afterDeleted = comment.isDeleted();
    assertThat(beforeDeleted).isFalse();
    assertThat(afterDeleted).isTrue();
  }

  @Test
  void findDeletableCommentWhenExistsTest() {
    // given
    // root 1
    // 1 -> 2
    // 2(del) -> 3(del)
    // 2(del) -> 4
    // 3(del) -> 5
    Comment comment1 = new Comment("content", user, post, null);
    Comment comment2 = new Comment("content", user, post, comment1);
    Comment comment3 = new Comment("content", user, post, comment2);
    Comment comment4 = new Comment("content", user, post, comment2);
    Comment comment5 = new Comment("content", user, post, comment3);
    comment2.delete();
    comment3.delete();
    ReflectionTestUtils.setField(comment1, "children", List.of(comment2));
    ReflectionTestUtils.setField(comment2, "children", List.of(comment3, comment4));
    ReflectionTestUtils.setField(comment3, "children", List.of(comment5));
    ReflectionTestUtils.setField(comment4, "children", List.of());
    ReflectionTestUtils.setField(comment5, "children", List.of());

    // when
    Optional<Comment> deletableComment = comment5.findDeletableComment();

    // then
    assertThat(deletableComment).containsSame(comment3);
  }

  @Test
  void findDeletableCommentWhenNotExistsTest() {
    // given
    // root 1
    // 1 -> 2
    // 2 -> 3
    Comment comment1 = new Comment("content", user, post, null);
    Comment comment2 = new Comment("content", user, post, comment1);
    Comment comment3 = new Comment("content", user, post, comment2);
    ReflectionTestUtils.setField(comment1, "children", List.of(comment2));
    ReflectionTestUtils.setField(comment2, "children", List.of(comment3));
    ReflectionTestUtils.setField(comment3, "children", List.of());

    // when
    Optional<Comment> deletableComment = comment2.findDeletableComment();

    // then
    assertThat(deletableComment).isEmpty();
  }
}
