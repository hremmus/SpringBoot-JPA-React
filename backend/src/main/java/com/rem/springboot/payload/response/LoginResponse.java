package com.rem.springboot.payload.response;

import com.rem.springboot.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LoginResponse {
  private UserDto user;
  private String accessToken;
  private String refreshToken;
}
