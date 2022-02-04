package com.rem.springboot.dto;

import com.rem.springboot.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDto {
  private Long id;
  private String email;
  private String nickname;

  public static UserDto toDto(User user) {
    return new UserDto(user.getId(), user.getEmail(), user.getNickname());
  }
}
