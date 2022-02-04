package com.rem.springboot.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.dto.Response;
import com.rem.springboot.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
  private final UserServiceImpl userService;

  @GetMapping("/user/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response read(@PathVariable Long id) {
    return Response.success(userService.read(id));
  }

  @DeleteMapping("/user/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response delete(@PathVariable Long id) {
    userService.delete(id);
    return Response.success();
  }
}
