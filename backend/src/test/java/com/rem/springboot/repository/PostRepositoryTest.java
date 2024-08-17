package com.rem.springboot.repository;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import com.rem.springboot.config.QuerydslConfig;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Image;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CategoryNotFoundException;
import com.rem.springboot.exception.PostNotFoundException;
import com.rem.springboot.payload.request.PostUpdateRequest;

@ActiveProfiles("test")
@DataJpaTest
@Import(QuerydslConfig.class)
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
  Category category1, category2;

  @BeforeEach
  void beforeEach() {
    user = userRepository.save(new User("user1@gmail.com", "123456", "nickname1", emptyList()));
    category1 = categoryRepository.save(new Category("category1", null));
    category2 = categoryRepository.save(new Category("category2", null));
  }

  @Test
  void createAndReadTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category1, List.of()));
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
    Post post = postRepository.save(new Post("title", "content", user, category1, List.of()));
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
    Post post = postRepository.save(new Post("title", "content", user, category1,
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
  void findByIdWithUserTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category1, List.of()));

    // when
    Post foundPost = postRepository.findByIdWithUser(post.getId()).orElseThrow(PostNotFoundException::new);

    // then
    User foundUser = foundPost.getUser();
    assertThat(foundUser.getEmail()).isEqualTo(user.getEmail());
  }

  @Test
  void deleteCascadeImageTest() {
    // given
    Post post = postRepository.save(new Post("title", "content", user, category1,
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

  @Test
  void updateTest() {
    // given
    Image a = new Image("a.jpg");
    Image b = new Image("b.png");
    Post post = postRepository.save(new Post("title", "content", user, category1, List.of(a, b)));
    em.flush();
    em.clear();

    // when
    MockMultipartFile cFile = new MockMultipartFile("c", "c.png", MediaType.IMAGE_PNG_VALUE, "cFile".getBytes());
    PostUpdateRequest postUpdateRequest = new PostUpdateRequest(
        "title update", "content update", 2L, List.of(cFile), List.of(a.getId()));
    Post foundPost = postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new);
    foundPost.update(postUpdateRequest);
    em.flush();
    em.clear();

    // then
    Post result = postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new);
    assertThat(result.getTitle()).isEqualTo(postUpdateRequest.getTitle());
    assertThat(result.getContent()).isEqualTo(postUpdateRequest.getContent());

    List<Image> images = result.getImages();
    List<String> originNames = images.stream().map(i -> i.getOriginName()).collect(toList());
    assertThat(images.size()).isEqualTo(2);
    assertThat(originNames).contains(cFile.getOriginalFilename(), b.getOriginName());

    List<Image> resultImages = imageRepository.findAll();
    assertThat(resultImages.size()).isEqualTo(2);
  }
}
