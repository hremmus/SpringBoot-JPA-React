package com.rem.springboot.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "카테고리 생성 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryCreateRequest {
  @ApiModelProperty(value = "카테고리 명", notes = "카테고리 명을 입력하세요.", required = true, example = "category1")
  @NotBlank(message = "{categoryCreateRequest.name.notBlank}")
  @Size(min = 2, max = 30, message = "{categoryCreateRequest.name.size}")
  private String name;

  @ApiModelProperty(value = "부모 카테고리 아이디", notes = "부모 카테고리 아이디를 입력하세요.", example = "7")
  private Long parentId;
}
