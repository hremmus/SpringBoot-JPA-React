package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.PasswordCheckRequest;
import com.rem.springboot.payload.request.UserUpdateRequest;
import com.rem.springboot.security.UserDetailsImpl;
import com.rem.springboot.service.UserServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import springfox.documentation.annotations.ApiIgnore;

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

  @ApiOperation(value = "회원 정보 변경 전 패스워드 확인")
  @PostMapping("/user/checkpassword")
  @ApiImplicitParams({@ApiImplicitParam(name = "Authorization", value = "accessToken", required = true, dataType = "String", paramType = "header")})
  @ResponseStatus(HttpStatus.OK)
  public Response checkPassword(@ApiIgnore @AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody PasswordCheckRequest request) {
    userService.checkPassword(Long.valueOf(userDetails.getId()), request);
    return Response.success();
  }

  @ApiOperation("회원 정보 변경")
  @PutMapping("/user")
  @ApiImplicitParams({@ApiImplicitParam(name = "Authorization", value = "accessToken", required = true, dataType = "String", paramType = "header")})
  @ResponseStatus(HttpStatus.OK)
  public Response update(@ApiIgnore @AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody UserUpdateRequest request) {
    return Response.success(userService.update(Long.valueOf(userDetails.getId()), request));
  }
}
