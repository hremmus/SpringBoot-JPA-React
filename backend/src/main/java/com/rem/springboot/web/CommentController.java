package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.aop.AssignUserId;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.CommentCreateRequest;
import com.rem.springboot.payload.request.CommentReadCondition;
import com.rem.springboot.payload.request.CommentUpdateRequest;
import com.rem.springboot.service.CommentServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(value = "Comment Controller", tags = "Comment")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {
  private final CommentServiceImpl commentService;

  @ApiOperation("댓글 생성")
  @PostMapping("/comments")
  @ResponseStatus(HttpStatus.CREATED)
  @AssignUserId
  public Response create(@Valid @RequestBody CommentCreateRequest request) {
    return Response.success(commentService.create(request));
  }

  @ApiOperation("해당 게시글의 모든 댓글 조회")
  @GetMapping("/comments")
  @ResponseStatus(HttpStatus.OK)
  public Response readAll(@Valid CommentReadCondition condition) {
    return Response.success(commentService.readAll(condition));
  }

  @ApiOperation("댓글 수정")
  @PatchMapping("/comments/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response update(@ApiParam(value = "댓글 ID", required = true) @PathVariable Long id,
      @Valid @RequestBody CommentUpdateRequest request) {
    return Response.success(commentService.update(id, request));
  }

  @ApiOperation("댓글 삭제")
  @DeleteMapping("/comments/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response delete(@ApiParam(value = "댓글 ID", required = true) @PathVariable Long id) {
    commentService.delete(id);
    return Response.success();
  }
}
