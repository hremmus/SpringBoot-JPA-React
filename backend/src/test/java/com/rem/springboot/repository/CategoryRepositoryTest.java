package com.rem.springboot.repository;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.test.context.ActiveProfiles;
import com.rem.springboot.config.QuerydslConfig;
import com.rem.springboot.entity.Category;
import com.rem.springboot.exception.CategoryNotFoundException;

@ActiveProfiles("test")
@DataJpaTest
@Import(QuerydslConfig.class)
class CategoryRepositoryTest {
  @Autowired
  CategoryRepository categoryRepository;

  @PersistenceContext
  EntityManager em;

  @Test
  void createAndReadTest() {
    // given
    Category category = new Category("name", null);

    // when
    Category savedCategory = categoryRepository.save(category);
    clear();

    // then
    Category foundCategory = categoryRepository.findById(savedCategory.getId())
        .orElseThrow(CategoryNotFoundException::new);
    assertThat(foundCategory.getId()).isEqualTo(savedCategory.getId());
  }

  @Test
  void readAllTest() {
    // given
    List<Category> categories = List.of("name1", "name2", "name3").stream()
        .map(n -> new Category(n, null)).collect(toList());
    categoryRepository.saveAll(categories);
    clear();

    // when
    List<Category> foundCategories = categoryRepository.findAll();

    // then
    assertThat(foundCategories.size()).isEqualTo(3);
  }

  @Test
  void deleteTest() {
    // given
    Category category = categoryRepository.save(new Category("name", null));
    clear();

    // when
    categoryRepository.delete(category);
    clear();

    // then
    assertThatThrownBy(() -> categoryRepository.findById(category.getId())
        .orElseThrow(CategoryNotFoundException::new)).isInstanceOf(CategoryNotFoundException.class);
  }

  @Test
  void deleteByIdTest() {
    // given
    Category category = categoryRepository.save(new Category("name", null));
    clear();

    // when
    categoryRepository.deleteById(category.getId());
    clear();

    // then
    assertThatThrownBy(() -> categoryRepository.findById(category.getId())
        .orElseThrow(CategoryNotFoundException::new)).isInstanceOf(CategoryNotFoundException.class);
  }

  @Test
  void deleteCascadeTest() {
    // given
    Category category1 = categoryRepository.save(new Category("category1", null));
    Category category2 = categoryRepository.save(new Category("category2", category1));
    Category category3 = categoryRepository.save(new Category("category3", category2));
    Category category4 = categoryRepository.save(new Category("category4", null));
    clear();

    // when
    categoryRepository.deleteById(category1.getId());
    clear();

    // then
    List<Category> foundCategories = categoryRepository.findAll();
    assertThat(foundCategories.size()).isEqualTo(1);
    assertThat(foundCategories.get(0).getId()).isEqualTo(category4.getId());
  }

  @Test
  void deleteNoneValueTest() {
    // given
    Long noneValueId = 100L;

    // when, then
    assertThatThrownBy(() -> categoryRepository.deleteById(noneValueId))
        .isInstanceOf(EmptyResultDataAccessException.class);
  }

  @Test
  void findAllWithParentOrderByParentIdAscNullsFirstCategoryIdAscTest() {
    // given
    // child parent
    // 1 NULL - root
    // 2 1
    // 3 1
    // 4 2
    // 5 2
    // 6 4
    // 7 3
    // 8 NULL - root
    Category c1 = categoryRepository.save(new Category("category1", null));
    Category c2 = categoryRepository.save(new Category("category2", c1));
    Category c3 = categoryRepository.save(new Category("category3", c1));
    Category c4 = categoryRepository.save(new Category("category4", c2));
    Category c5 = categoryRepository.save(new Category("category5", c2));
    Category c6 = categoryRepository.save(new Category("category6", c4));
    Category c7 = categoryRepository.save(new Category("category7", c3));
    Category c8 = categoryRepository.save(new Category("category8", null));
    clear();

    // when
    List<Category> result = categoryRepository.findAllOrderByParentIdAscNullsFirstCategoryIdAsc();

    // then
    // child parent
    // 1 NULL - root
    // 8 NULL - root
    // 2 1
    // 3 1
    // 4 2
    // 5 2
    // 7 3
    // 6 4
    assertThat(result.size()).isEqualTo(8);
    assertThat(result.get(0).getId()).isEqualTo(c1.getId());
    assertThat(result.get(1).getId()).isEqualTo(c8.getId());
    assertThat(result.get(2).getId()).isEqualTo(c2.getId());
    assertThat(result.get(3).getId()).isEqualTo(c3.getId());
    assertThat(result.get(4).getId()).isEqualTo(c4.getId());
    assertThat(result.get(5).getId()).isEqualTo(c5.getId());
    assertThat(result.get(6).getId()).isEqualTo(c7.getId());
    assertThat(result.get(7).getId()).isEqualTo(c6.getId());
  }

  void clear() {
    em.flush();
    em.clear();
  }
}
