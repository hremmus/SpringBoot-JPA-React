package com.rem.springboot.web;

import static com.rem.springboot.dto.Response.success;
import javax.management.relation.RoleNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.request.SignUpRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.security.JwtUtils;
import com.rem.springboot.service.AuthServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import springfox.documentation.annotations.ApiIgnore;

@Api(value = "Auth Controller", tags = "Auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthServiceImpl authService;
  private final JwtUtils refreshTokenProvider;

  @ApiOperation("회원 가입")
  @PostMapping("/signup")
  @ResponseStatus(HttpStatus.CREATED)
  public Response registerUser(@Valid @RequestBody SignUpRequest request) throws RoleNotFoundException {
    authService.signUp(request);
    return success();
  }

  @ApiOperation(value = "로그인", notes="로그인 성공 시 JWT 토큰을 반환한다.")
  @PostMapping("/signin")
  @ResponseStatus(HttpStatus.OK)
  public ResponseEntity<?> authenticateUser(HttpServletRequest httpServletRequest, @Valid @RequestBody LoginRequest request) {
    LoginResponse response = authService.login(request);
    ResponseCookie jwtCookie = refreshTokenProvider.createJwtCookie(response.getRefreshToken());
    response.setRefreshToken(null);
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(success(response));
  }

  @ApiOperation(value = "토큰 재발급", notes="리프레시 토큰을 넘겨 받아 새 액세스 토큰을 발급한다.")
  @PostMapping("/refreshtoken")
  @ResponseStatus(HttpStatus.OK)
  public Response refreshToken(@ApiIgnore @RequestHeader("Authorization") String refreshToken) {
    return success(authService.refreshToken(refreshToken));
  }
}