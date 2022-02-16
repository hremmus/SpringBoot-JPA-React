package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
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
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {
  private final PostServiceImpl postService;

  @PostMapping("/posts")
  @ResponseStatus(HttpStatus.CREATED)
  @AssignUserId
  public Response create(@Valid @ModelAttribute PostCreateRequest request) {
    return Response.success(postService.create(request));
  }

  @GetMapping("/posts")
  @ResponseStatus(HttpStatus.OK)
  public Response readAll(@Valid PostReadCondition condition) {
    return Response.success(postService.readAll(condition));
  }

  @GetMapping("/posts/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response read(@PathVariable Long id) {
    return Response.success(postService.read(id));
  }

  @PutMapping("/posts/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response update(@PathVariable Long id, @Valid @ModelAttribute PostUpdateRequest request) {
    return Response.success(postService.update(id, request));
  }
}
