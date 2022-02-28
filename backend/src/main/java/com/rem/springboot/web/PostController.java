package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.aop.AssignUserId;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.PostCreateRequest;
import com.rem.springboot.payload.request.PostUpdateRequest;
import com.rem.springboot.service.PostServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(value = "Post Controller", tags = "Post")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {
  private final PostServiceImpl postService;

  @ApiOperation("게시글 생성")
  @PostMapping("/posts")
  @ResponseStatus(HttpStatus.CREATED)
  @AssignUserId
  public Response create(@Valid @ModelAttribute PostCreateRequest request) {
    return Response.success(postService.create(request));
  }

  @ApiOperation("게시글 목록 조회")
  @GetMapping("/posts")
  @ResponseStatus(HttpStatus.OK)
  public Response readAll(@Valid PostReadCondition condition) {
    return Response.success(postService.readAll(condition));
  }

  @ApiOperation("게시글 조회")
  @GetMapping("/posts/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response read(@ApiParam(value = "게시글 ID", required = true) @PathVariable Long id) {
    return Response.success(postService.read(id));
  }

  @ApiOperation("게시글 수정")
  @PutMapping("/posts/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response update(@ApiParam(value = "게시글 ID", required = true) @PathVariable Long id,
      @Valid @ModelAttribute PostUpdateRequest request) {
    return Response.success(postService.update(id, request));
  }

  @ApiOperation("게시글 삭제")
  @DeleteMapping("/posts/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response delete(@ApiParam(value = "게시글 ID", required = true) @PathVariable Long id) {
    postService.delete(id);
    return Response.success();
  }
}
