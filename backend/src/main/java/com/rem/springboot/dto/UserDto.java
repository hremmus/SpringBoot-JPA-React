package com.rem.springboot.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
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
  private Set<String> roles;
  @JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private LocalDateTime createdDate;

  public static UserDto toDto(User user) {
    return new UserDto(user.getId(), user.getEmail(), user.getNickname(), user.getRoles().stream()
        .map(userRole -> userRole.getRole().getName().name()).collect(Collectors.toSet()), user.getCreatedDate());
  }
}
