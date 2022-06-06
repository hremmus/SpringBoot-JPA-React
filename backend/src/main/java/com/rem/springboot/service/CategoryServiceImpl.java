package com.rem.springboot.service;

import java.util.List;
import java.util.Optional;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.dto.CategoryDto;
import com.rem.springboot.entity.Category;
import com.rem.springboot.exception.CategoryConstraintViolationException;
import com.rem.springboot.exception.CategoryNotFoundException;
import com.rem.springboot.payload.request.CategoryCreateRequest;
import com.rem.springboot.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class CategoryServiceImpl {
  private final CategoryRepository categoryRepository;

  public List<CategoryDto> readAll() {
    List<Category> categories = categoryRepository.findAllOrderByParentIdAscNullsFirstCategoryIdAsc();
    return CategoryDto.toDtoList(categories);
  }

  @Transactional
  public void create(CategoryCreateRequest request) {
    Category parent = Optional.ofNullable(request.getParentId())
        .map(id -> categoryRepository.findById(id).orElseThrow(CategoryNotFoundException::new))
        .orElse(null);
    categoryRepository.save(new Category(request.getName(), parent));
  }

  @Transactional
  public void delete(Long id) {
    try {
      Category category = categoryRepository.findById(id).orElseThrow(CategoryNotFoundException::new);
      categoryRepository.delete(category);
    } catch (ConstraintViolationException e) {
      throw new CategoryConstraintViolationException();
    }
  }
}
