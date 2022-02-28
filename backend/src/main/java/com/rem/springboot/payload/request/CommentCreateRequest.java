package com.rem.springboot.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Positive;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "댓글 생성 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentCreateRequest {
  @ApiModelProperty(value = "댓글", notes = "댓글을 입력하세요.", required = true, example = "content")
  @NotBlank(message = "{commentCreateRequest.content.notBlank}")
  private String content;

  @ApiModelProperty(value = "게시글 번호", notes = "게시글 번호를 입력하세요.", example = "1")
  @NotNull(message = "{commentCreateRequest.postId.notNull}")
  @Positive(message = "{commentCreateRequest.postId.positive}")
  private Long postId;

  @ApiModelProperty(hidden = true)
  @Null
  private Long userId;

  @ApiModelProperty(value = "부모 댓글 번호", notes = "부모 댓글 번호를 입력하세요.", example = "7")
  private Long parentId;
}
