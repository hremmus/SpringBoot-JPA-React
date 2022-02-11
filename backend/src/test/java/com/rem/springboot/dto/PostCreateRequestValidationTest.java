package com.rem.springboot.dto;

import static java.util.stream.Collectors.toSet;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import org.junit.jupiter.api.Test;
import com.rem.springboot.payload.request.PostCreateRequest;

class PostCreateRequestValidationTest {
  Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

  @Test
  void validateTest() {
    // given
    PostCreateRequest request = new PostCreateRequest("title", "content", null, 1L, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isEmpty();
  }

  @Test
  void invalidateByEmptyTitleTest() {
    // given
    String invalidValue = null;
    PostCreateRequest request = new PostCreateRequest(invalidValue, "content", 1L, 1L, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }

  @Test
  void invalidateByBlankTitleTest() {
    // given
    String invalidValue = " ";
    PostCreateRequest request = new PostCreateRequest(invalidValue, "content", 1L, 1L, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }

  @Test
  void invalidateByEmptyContentTest() {
    // given
    String invalidValue = null;
    PostCreateRequest request = new PostCreateRequest("title", invalidValue, 1L, 1L, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }

  @Test
  void invalidateByBlankContentTest() {
    // given
    String invalidValue = " ";
    PostCreateRequest request = new PostCreateRequest("title", invalidValue, 1L, 1L, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }

  @Test
  void invalidateByNotNullUserIdTest() {
    // given
    Long invalidValue = 1L;
    PostCreateRequest request = new PostCreateRequest("title", "content", invalidValue, 1L, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }

  @Test
  void invalidateByNullCategoryIdTest() {
    // given
    Long invalidValue = null;
    PostCreateRequest request = new PostCreateRequest("title", "content", 1L, invalidValue, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }

  @Test
  void invalidateByNegativeCategoryIdTest() {
    // given
    Long invalidValue = -1L;
    PostCreateRequest request = new PostCreateRequest("title", "content", 1L, invalidValue, List.of());

    // when
    Set<ConstraintViolation<PostCreateRequest>> validate = validator.validate(request);

    // then
    assertThat(validate).isNotEmpty();
    assertThat(validate.stream().map(v -> v.getInvalidValue()).collect(toSet())).contains(invalidValue);
  }
}