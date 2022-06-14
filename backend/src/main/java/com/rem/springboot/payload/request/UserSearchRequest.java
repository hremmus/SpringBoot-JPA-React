package com.rem.springboot.payload.request;

import javax.validation.constraints.Pattern;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "사용자 목록 검색")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserSearchRequest {
  String email = "";

  @Pattern(regexp = "^[A-Za-z가-힣]+$", message = "{signUpRequest.nickname.pattern}")
  String nickname = "";
}
