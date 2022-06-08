package com.rem.springboot.payload.request;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "사용자 정보 변경 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserUpdateRequest {
  @ApiModelProperty(value = "닉네임", notes = "닉네임은 한글 또는 알파벳으로 입력해주세요.", example = "nickname")
  @Size(min = 2, max = 10, message = "{signUpRequest.nickname.size}")
  @Pattern(regexp = "^[A-Za-z가-힣]+$", message = "{signUpRequest.nickname.pattern}")
  private String nickname;

  @ApiModelProperty(value = "비밀번호", notes = "비밀번호는 최소 8자리면서 1개 이상의 알파벳, 숫자, 특수문자를 포함해야 합니다.",
      example = "123456a!")
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
      message = "{signUpRequest.password.pattern}")
  private String password;
}
