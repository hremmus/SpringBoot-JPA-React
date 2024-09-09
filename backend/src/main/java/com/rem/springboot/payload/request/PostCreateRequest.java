package com.rem.springboot.payload.request;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "게시글 생성 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostCreateRequest {
  @ApiModelProperty(value = "게시글 제목", notes = "제목을 입력하세요.", required = true, example = "title")
  @NotBlank(message = "{postCreateRequest.title.notBlank}")
  private String title;

  @ApiModelProperty(value = "게시글 본문", notes = "본문을 입력하세요.", required = true, example = "content")
  @NotBlank(message = "{postCreateRequest.content.notBlank}")
  private String content;

  @ApiModelProperty(hidden = true)
  @Null
  private Long userId;

  @ApiModelProperty(value = "카테고리 번호", notes = "카테고리 번호를 입력하세요.", required = true, example = "3")
  @NotNull(message = "{postCreateRequest.categoryId.notNull}")
  @PositiveOrZero(message = "{postCreateRequest.categoryId.positiveOrZero}")
  private Long categoryId;

  @ApiModelProperty(value = "이미지", notes = "이미지를 첨부하세요.")
  private List<MultipartFile> images = new ArrayList<>();
}
