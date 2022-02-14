package com.rem.springboot.repository;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import com.rem.springboot.config.QuerydslConfig;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.dto.PostSimpleDto;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;

@Import(QuerydslConfig.class)
@DataJpaTest
class CustomPostRepositoryImplTest {
  @PersistenceContext
  EntityManager em;

  @Autowired
  PostRepository postRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  CategoryRepository categoryRepository;

  @Test
  void findAllByConditionTest() {
    // given
    List<User> users = saveUsers(3);
    List<Category> categories = saveCategories(2);

    //       index
    // post user category
    //  0:    0     0
    //  1:    1     1
    //  2:    2     0
    //  3:    0     1
    //  4:    1     0
    //  5:    2     1
    //  6:    0     0
    //  7:    1     1
    //  8:    2     0
    //  9:    0     1
    List<Post> posts = IntStream.range(0, 10).mapToObj(i -> postRepository.save(
        new Post("title", "content", users.get(i % 3), categories.get(i % 2), emptyList())))
        .collect(toList());
    em.flush();
    em.clear();

    List<Long> categoryIds = List.of(categories.get(1).getId());
    List<Long> userIds = List.of(users.get(0).getId(), users.get(2).getId());
    int sizePerPage = 2;
    long expectedTotalElements = 3; // 9, 5, 3

    PostReadCondition page0Condition = new PostReadCondition(0, sizePerPage, categoryIds, userIds);
    PostReadCondition page1Condition = new PostReadCondition(1, sizePerPage, categoryIds, userIds);

    // when
    Page<PostSimpleDto> page0 = postRepository.findAllByCondition(page0Condition);
    Page<PostSimpleDto> page1 = postRepository.findAllByCondition(page1Condition);

    // then
    assertThat(page0.getTotalElements()).isEqualTo(expectedTotalElements);
    assertThat(page0.getTotalPages()).isEqualTo((expectedTotalElements + 1) / sizePerPage);

    assertThat(page0.getContent().size()).isEqualTo(2);
    assertThat(page1.getContent().size()).isEqualTo(1);

    //    page 0
    // 9:    0     1
    // 5:    2     1
    assertThat(page0.getContent().get(0).getId()).isEqualTo(posts.get(9).getId());
    assertThat(page0.getContent().get(1).getId()).isEqualTo(posts.get(5).getId());
    assertThat(page0.hasNext()).isTrue();

    //    page 1
    // 3:    0     1
    assertThat(page1.getContent().get(0).getId()).isEqualTo(posts.get(3).getId());
    assertThat(page1.hasNext()).isFalse();
  }

  private List<User> saveUsers(int size) {
    return IntStream.range(0, size).mapToObj(i -> userRepository.save(createUser((long) i)))
        .collect(toList());
  }

  private User createUser(Long id) {
    return new User("user" + id + "@email.com", "123456a!", "nickname" + id, emptyList());
  }

  private List<Category> saveCategories(int size) {
    return IntStream.range(0, size).mapToObj(i -> categoryRepository.save(
        new Category("category" + i, null)))
        .collect(toList());
  }
}
