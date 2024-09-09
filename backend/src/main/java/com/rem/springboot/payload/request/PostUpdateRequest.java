package com.rem.springboot.payload.request;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "게시글 수정 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostUpdateRequest {
  @ApiModelProperty(value = "게시글 제목", notes = "제목을 입력하세요.", required = true, example = "title")
  @NotBlank(message = "{postUpdateRequest.title.notBlank}")
  private String title;

  @ApiModelProperty(value = "게시글 본문", notes = "본문을 입력하세요.", required = true, example = "content")
  @NotBlank(message = "{postUpdateRequest.content.notBlank}")
  private String content;

  @ApiModelProperty(value = "게시글 카테고리", notes = "카테고리를 선택하세요.", required = true, example = "1")
  @NotNull(message = "{postUpdateRequest.categoryId.notNull}")
  private Long categoryId;

  @ApiModelProperty(value = "이미지 추가", notes = "이미지를 첨부하세요.")
  private List<MultipartFile> addedImages = new ArrayList<>();

  @ApiModelProperty(value = "이미지 제거", notes = "제거할 이미지의 번호를 입력하세요.")
  private List<Long> deletedImages = new ArrayList<>();
}
