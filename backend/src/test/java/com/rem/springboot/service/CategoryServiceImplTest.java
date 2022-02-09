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
import com.rem.springboot.dto.CategoryDto;
import com.rem.springboot.entity.Category;
import com.rem.springboot.exception.CategoryNotFoundException;
import com.rem.springboot.payload.request.CategoryCreateRequest;
import com.rem.springboot.repository.CategoryRepository;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTest {
  @InjectMocks
  CategoryServiceImpl categoryService;

  @Mock
  CategoryRepository categoryRepository;

  @Test
  void readAllTest() {
    // given
    given(categoryRepository.findAllOrderByParentIdAscNullsFirstCategoryIdAsc())
    .willReturn(List.of(
        new Category("name1", null),
        new Category("name2", null)));

    // when
    List<CategoryDto> result = categoryService.readAll();

    // then
    assertThat(result.size()).isEqualTo(2);
    assertThat(result.get(0).getName()).isEqualTo("name1");
    assertThat(result.get(1).getName()).isEqualTo("name2");
  }

  @Test
  void createTest() {
    // given
    CategoryCreateRequest request = new CategoryCreateRequest("category", null);

    // when
    categoryService.create(request);

    // then
    verify(categoryRepository).save(any());
  }

  @Test
  void deleteTest() {
    // given
    given(categoryRepository.findById(anyLong())).willReturn(Optional.of(new Category("name", null)));

    // when
    categoryService.delete(1L);

    // then
    verify(categoryRepository).delete(any());
  }

  @Test
  void deleteExceptionByCategoryNotFoundTest() {
    // given
    given(categoryRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> categoryService.delete(1L)).isInstanceOf(CategoryNotFoundException.class);
  }
}
