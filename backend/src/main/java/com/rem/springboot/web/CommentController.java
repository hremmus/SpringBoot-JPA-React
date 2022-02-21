package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.aop.AssignUserId;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.CommentCreateRequest;
import com.rem.springboot.payload.request.CommentReadCondition;
import com.rem.springboot.service.CommentServiceImpl;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {
  private final CommentServiceImpl commentService;

  @PostMapping("/comments")
  @ResponseStatus(HttpStatus.CREATED)
  @AssignUserId
  public Response create(@Valid @RequestBody CommentCreateRequest request) {
    commentService.create(request);
    return Response.success();
  }

  @GetMapping("/comments")
  @ResponseStatus(HttpStatus.OK)
  public Response readAll(@Valid CommentReadCondition condition) {
    return Response.success(commentService.readAll(condition));
  }
}
