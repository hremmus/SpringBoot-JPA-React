package com.rem.springboot.payload.request;

import java.util.Set;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel("회원가입 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignUpRequest {
  public SignUpRequest(@NotBlank @Size(max = 40) @Email String email,
      @NotBlank @Size(min = 6, max = 20) String password,
      @NotBlank @Size(min = 2, max = 10) String nickname) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
  }

  @ApiModelProperty(value = "이메일", notes = "이메일을 입력해주세요.", required = true, example = "user@email.com")
  @NotBlank(message = "{signUpRequest.email.notBlank}")
  @Size(max = 40)
  @Email(message = "{signUpRequest.email.email")
  private String email;

  @ApiModelProperty(value = "비밀번호", notes = "비밀번호는 최소 8자리면서 1개 이상의 알파벳, 숫자, 특수문자를 포함해야 합니다.", required = true, example = "123456a!")
  @NotBlank(message = "{signUpRequest.password.notBlank}")
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
  message = "{signUpRequest.password.pattern}")
  private String password;

  @ApiModelProperty(value = "닉네임", notes = "닉네임은 한글 또는 알파벳으로 입력해주세요.", required = true, example = "말랑")
  @NotBlank(message = "{signUpRequest.nickname.notBlank}")
  @Size(min = 2, max = 10, message = "{signUpRequest.nickname.size}")
  @Pattern(regexp = "^[A-Za-z가-힣]+$", message = "{signUpRequest.nickname.pattern}")
  private String nickname;

  @ApiModelProperty(hidden = true)
  private Set<String> role;
}