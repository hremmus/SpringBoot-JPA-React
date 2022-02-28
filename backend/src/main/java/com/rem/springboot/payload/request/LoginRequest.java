package com.rem.springboot.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel("로그인 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class LoginRequest {
  @ApiModelProperty(value = "이메일", notes = "이메일을 입력하세요.", required = true, example = "user1@email.com")
  @NotBlank(message = "{loginRequest.email.notBlank}")
  @Email(message = "{loginRequest.email.email}")
  private String email;

  @ApiModelProperty(value = "비밀번호", notes = "비밀번호를 입력하세요.", required = true, example = "123456a!")
  @NotBlank(message = "{loginRequest.password.notBlank}")
  private String password;
}