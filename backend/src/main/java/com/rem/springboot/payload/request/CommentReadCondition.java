package com.rem.springboot.payload.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentReadCondition {
  @NotNull(message = "게시글 번호를 입력하세요.")
  @PositiveOrZero(message = "게시글 번호를 올바르게 입력하세요.")
  private Long postId;
}
