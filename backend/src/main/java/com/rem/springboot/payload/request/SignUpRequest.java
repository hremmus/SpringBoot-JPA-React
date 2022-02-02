package com.rem.springboot.payload.request;

import java.util.Set;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

  @NotBlank
  @Size(max = 40)
  @Email
  private String email;

  @NotBlank
  @Size(min = 6, max = 20)
  private String password;

  @NotBlank
  @Size(min = 2, max = 10)
  private String nickname;

  private Set<String> role;
}