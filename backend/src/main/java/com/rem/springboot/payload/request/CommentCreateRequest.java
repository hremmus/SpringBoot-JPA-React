package com.rem.springboot.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentCreateRequest {
  @NotBlank
  private String content;

  @NotNull
  @Positive
  private Long postId;

  @Null
  private Long userId;

  private Long parentId;
}
