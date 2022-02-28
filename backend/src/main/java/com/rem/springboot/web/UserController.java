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
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(value = "User Controller", tags = "User")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
  private final UserServiceImpl userService;

  @ApiOperation(value = "회원 정보 조회")
  @GetMapping("/user/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response read(@ApiParam(value = "회원 ID", required = true) @PathVariable Long id) {
    return Response.success(userService.read(id));
  }

  @ApiOperation(value = "회원 정보 삭제")
  @DeleteMapping("/user/{id}")
  @ResponseStatus(HttpStatus.OK)
  public Response delete(@ApiParam(value = "회원 ID", required = true) @PathVariable Long id) {
    userService.delete(id);
    return Response.success();
  }
}
