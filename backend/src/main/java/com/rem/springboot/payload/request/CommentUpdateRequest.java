package com.rem.springboot.payload.request;

import javax.validation.constraints.NotBlank;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel("댓글 수정 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentUpdateRequest {
  @ApiModelProperty(value = "댓글 번호", notes = "댓글 번호 입력하세요.", required = true, example = "2")
  @NotBlank
  private String content;
}
