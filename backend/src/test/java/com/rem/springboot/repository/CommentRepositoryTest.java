package com.rem.springboot.repository;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.rem.springboot.config.QuerydslConfig;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Comment;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CommentNotFoundException;
import com.rem.springboot.payload.request.CommentUpdateRequest;

@DataJpaTest
@Import(QuerydslConfig.class)
class CommentRepositoryTest {
  @PersistenceContext
  EntityManager em;

  @Autowired
  UserRepository userRepository;

  @Autowired
  CategoryRepository categoryRepository;

  @Autowired
  PostRepository postRepository;

  @Autowired
  CommentRepository commentRepository;

  User user;
  Category category;
  Post post;

  @BeforeEach
  void beforeEach() {
    user = userRepository.save(new User("user@email.com", "123456!a", "nickname", List.of()));
    category = categoryRepository.save(new Category("category", null));
    post = postRepository.save(new Post("title", "content", user, category, List.of()));
  }

  @Test
  void createAndReadTest() {
    // given
    Comment comment = commentRepository.save(new Comment("conment", user, post, null));
    em.flush();
    em.clear();

    // when
    Comment foundComment = commentRepository.findById(comment.getId()).orElseThrow(CommentNotFoundException::new);

    // then
    assertThat(foundComment.getId()).isEqualTo(comment.getId());
  }

  @Test
  void deleteTest() {
    // given
    Comment comment = commentRepository.save(new Comment("conment", user, post, null));
    em.flush();
    em.clear();

    // when
    commentRepository.deleteById(comment.getId());

    // then
    assertThat(commentRepository.findById(comment.getId())).isEmpty();
  }

  @Test
  void deleteCascadeByPostTest() {
    // given
    Comment comment = commentRepository.save(new Comment("conment", user, post, null));
    em.flush();
    em.clear();

    // when
    postRepository.deleteById(post.getId());
    em.flush();
    em.clear();

    // then
    assertThat(commentRepository.findById(comment.getId())).isEmpty();
  }

  @Test
  void deleteCascadeByParentTest() {
    // given
    Comment parent = commentRepository.save(new Comment("comment1", user, post, null));
    Comment child = commentRepository.save(new Comment("comment2", user, post, parent));
    em.flush();
    em.clear();

    // when
    commentRepository.deleteById(parent.getId());
    em.flush();
    em.clear();

    // then
    assertThat(commentRepository.findById(child.getId())).isEmpty();
  }

  @Test
  void getChildrenTest() {
    // given
    Comment parent = commentRepository.save(new Comment("comment1", user, post, null));
    commentRepository.save(new Comment("comment2", user, post, parent));
    commentRepository.save(new Comment("comment3", user, post, parent));
    em.flush();
    em.clear();

    // when
    Comment comment = commentRepository.findById(parent.getId()).orElseThrow(CommentNotFoundException::new);

    // then
    assertThat(comment.getChildren().size()).isEqualTo(2);
  }

  @Test
  void findWithParentByIdTest() {
    // given
    Comment parent = commentRepository.save(new Comment("comment1", user, post, null));
    Comment child = commentRepository.save(new Comment("comment2", user, post, parent));
    em.flush();
    em.clear();

    // when
    Comment comment = commentRepository.findByIdIfParentPresent(child.getId()).orElseThrow(CommentNotFoundException::new);

    // then
    assertThat(comment.getParent().getContent()).isEqualTo("comment1");
  }

  @Test
  void deleteCommentTest() {
    // given
    // root 1
    // 1 -> 2
    // 2(del) -> 3(del)
    // 2(del) -> 4
    // 3(del) -> 5
    Comment comment1 = commentRepository.save(new Comment("comment1", user, post, null));
    Comment comment2 = commentRepository.save(new Comment("comment2", user, post, comment1));
    Comment comment3 = commentRepository.save(new Comment("comment3", user, post, comment2));
    Comment comment4 = commentRepository.save(new Comment("comment4", user, post, comment2));
    Comment comment5 = commentRepository.save(new Comment("comment5", user, post, comment3));
    comment2.delete();
    comment3.delete();
    em.flush();
    em.clear();

    // when
    Comment comment = commentRepository.findByIdIfParentPresent(comment5.getId()).orElseThrow(CommentNotFoundException::new);
    comment.findDeletableComment().ifPresentOrElse(c -> commentRepository.delete(c), () -> comment5.delete());
    em.flush();
    em.clear();

    // then
    List<Comment> comments = commentRepository.findAll();
    List<Long> commentIds = comments.stream().map(c -> c.getId()).collect(toList());
    assertThat(commentIds.size()).isEqualTo(3);
    assertThat(commentIds).contains(comment1.getId(), comment2.getId(), comment4.getId());
  }

  @Test
  void deleteCommentQueryLogTest() {
    // given
    // 1(del) -> 2(del) -> 3(del) -> 4(del) -> 5
    Comment comment1 = commentRepository.save(new Comment("comment1", user, post, null));
    Comment comment2 = commentRepository.save(new Comment("comment2", user, post, comment1));
    Comment comment3 = commentRepository.save(new Comment("comment3", user, post, comment2));
    Comment comment4 = commentRepository.save(new Comment("comment4", user, post, comment3));
    Comment comment5 = commentRepository.save(new Comment("comment5", user, post, comment4));
    comment1.delete();
    comment2.delete();
    comment3.delete();
    comment4.delete();
    em.flush();
    em.clear();

    // when
    Comment comment = commentRepository.findByIdIfParentPresent(comment5.getId()).orElseThrow(CommentNotFoundException::new);
    comment.findDeletableComment().ifPresentOrElse(c -> commentRepository.delete(c), () -> comment5.delete());
    em.flush();
    em.clear();

    // then
    List<Comment> comments = commentRepository.findAll();
    List<Long> commentIds = comments.stream().map(c -> c.getId()).collect(toList());
    assertThat(commentIds.size()).isEqualTo(0);
  }

  @Test
  void findAllWithUserAndParentByPostIdOrderByParentIdAscNullsFirstCommentIdAscTest() {
    // given
    // 1 NULL
    // 2  1
    // 3  1
    // 4  2
    // 5  3
    // 6  4
    // 7  3
    // 8 NULL
    Comment comment1 = commentRepository.save(new Comment("comment1", user, post, null));
    Comment comment2 = commentRepository.save(new Comment("comment2", user, post, comment1));
    Comment comment3 = commentRepository.save(new Comment("comment3", user, post, comment1));
    Comment comment4 = commentRepository.save(new Comment("comment4", user, post, comment2));
    Comment comment5 = commentRepository.save(new Comment("comment5", user, post, comment3));
    Comment comment6 = commentRepository.save(new Comment("comment2", user, post, comment4));
    Comment comment7 = commentRepository.save(new Comment("comment3", user, post, comment3));
    Comment comment8 = commentRepository.save(new Comment("comment4", user, post, null));
    em.flush();
    em.clear();

    // when
    List<Comment> result = commentRepository.findAllWithUserAndParentByPostIdOrderByParentIdAscNullsFirstCommentIdAsc(post.getId());

    // then
    // 1 NULL
    // 8 NULL
    // 2  1
    // 3  1
    // 4  2
    // 5  3
    // 7  3
    // 6  4
    assertThat(result.size()).isEqualTo(8);
    assertThat(result.get(0).getId()).isEqualTo(comment1.getId());
    assertThat(result.get(1).getId()).isEqualTo(comment8.getId());
    assertThat(result.get(2).getId()).isEqualTo(comment2.getId());
    assertThat(result.get(3).getId()).isEqualTo(comment3.getId());
    assertThat(result.get(4).getId()).isEqualTo(comment4.getId());
    assertThat(result.get(5).getId()).isEqualTo(comment5.getId());
    assertThat(result.get(6).getId()).isEqualTo(comment7.getId());
    assertThat(result.get(7).getId()).isEqualTo(comment6.getId());
  }

  @Test
  void updateTest() {
    // given
    Comment comment = commentRepository.save(new Comment("content", user, post, null));
    em.flush();
    em.clear();

    // when
    CommentUpdateRequest request = new CommentUpdateRequest("updated content");
    Comment foundComment = commentRepository.findById(comment.getId()).orElseThrow(CommentNotFoundException::new);
    foundComment.update(request.getContent());
    em.flush();
    em.clear();

    // then
    Comment result = commentRepository.findById(comment.getId()).orElseThrow(CommentNotFoundException::new);
    assertThat(result.getContent()).isEqualTo(request.getContent());
  }
}
