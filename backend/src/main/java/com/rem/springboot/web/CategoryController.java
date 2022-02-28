package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.CategoryCreateRequest;
import com.rem.springboot.service.CategoryServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(value = "Category Controller", tags = "Category")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {
  private final CategoryServiceImpl categoryService;

  @ApiOperation("모든 카테고리 조회")
  @GetMapping("/categories")
  @ResponseStatus(HttpStatus.OK)
  public Response readAll() {
    return Response.success(categoryService.readAll());
  }

  @ApiOperation("카테고리 생성")
  @PostMapping("/categories")
  @ResponseStatus(HttpStatus.CREATED)
  public Response create(@Valid @RequestBody CategoryCreateRequest request) {
    categoryService.create(request);
    return Response.success();
  }

  @ApiOperation("카테고리 삭제")
  @DeleteMapping("/categories/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response delete(@ApiParam(value = "카테고리 ID", required = true) @PathVariable Long id) {
    categoryService.delete(id);
    return Response.success();
  }
}
