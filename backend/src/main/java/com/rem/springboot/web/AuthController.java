package com.rem.springboot.web;

import static com.rem.springboot.dto.Response.success;
import javax.management.relation.RoleNotFoundException;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.request.SignUpRequest;
import com.rem.springboot.service.AuthServiceImpl;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthServiceImpl authService;

  @PostMapping("/signin")
  @ResponseStatus(HttpStatus.OK)
  public Response authenticateUser(@Valid @RequestBody LoginRequest request) {
    return success(authService.login(request));
  }

  @PostMapping("/signup")
  @ResponseStatus(HttpStatus.CREATED)
  public Response registerUser(@Valid @RequestBody SignUpRequest request) throws RoleNotFoundException {
    authService.signUp(request);
    return success();
  }
}