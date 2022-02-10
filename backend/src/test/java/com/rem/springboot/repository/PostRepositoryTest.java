package com.rem.springboot.repository;

import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Image;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.PostNotFoundException;

@DataJpaTest
class PostRepositoryTest {
  @PersistenceContext
  EntityManager em;

  @Autowired
  PostRepository postRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  CategoryRepository categoryRepository;

  @Autowired
  ImageRepository imageRepository;

  User user;
  Category category;

  @BeforeEach
  void beforeEach() {
    user = userRepository.save(new User("user1@gmail.com", "123456", "nickname1", emptyList()));
    category = categoryRepository.save(new Category("category1", null));
  }

  @Test
  void createAndReadTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category, List.of()));
    em.flush();
    em.clear();

    // when
    Post foundPost = postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new);

    // then
    assertThat(foundPost.getId()).isEqualTo(post.getId());
    assertThat(foundPost.getTitle()).isEqualTo(post.getTitle());
  }

  @Test
  void deleteTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category, List.of()));
    em.flush();
    em.clear();

    // when
    postRepository.deleteById(post.getId());
    em.flush();
    em.clear();

    // then
    assertThatThrownBy(() -> postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new))
    .isInstanceOf(PostNotFoundException.class);
  }

  @Test
  void createCascadeImageTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category,
        List.of(new Image("origin_filename1.jpg"), new Image("origin_filename2.jpg"))));
    em.flush();
    em.clear();

    // when
    Post foundPost = postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new);

    // then
    List<Image> images = foundPost.getImages();
    assertThat(images.size()).isEqualTo(2);
  }

  @Test
  void deleteCascadeImageTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category,
        List.of(new Image("origin_filename1.jpg"), new Image("origin_filename2.jpg"))));
    em.flush();
    em.clear();

    // when
    postRepository.deleteById(post.getId());
    em.flush();
    em.clear();

    // then
    List<Image> images = imageRepository.findAll();
    assertThat(images.size()).isZero();
  }
}
