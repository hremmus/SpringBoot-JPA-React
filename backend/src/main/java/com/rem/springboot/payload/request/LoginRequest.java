package com.rem.springboot.payload.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class LoginRequest {
  private String username;
  private String password;

  public void setUsername(String username) {
    this.username = (username != null && !username.isEmpty()) ? username.toLowerCase() : null;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}