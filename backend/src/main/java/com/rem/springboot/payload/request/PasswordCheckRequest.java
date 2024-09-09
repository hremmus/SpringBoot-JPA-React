package com.rem.springboot.payload.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel("패스워드 확인 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PasswordCheckRequest {
  @ApiModelProperty(value = "비밀번호", notes = "비밀번호를 입력하세요.", required = true, example = "123456a!")
  @NotBlank(message = "{loginRequest.password.notBlank}")
  private String password;
}
