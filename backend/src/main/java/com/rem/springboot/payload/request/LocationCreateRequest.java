package com.rem.springboot.payload.request;

import javax.validation.constraints.NotBlank;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ApiModel(value = "지역 추가 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LocationCreateRequest {
  @ApiModelProperty(value = "도", notes = "도를 입력하세요.", required = true, example = "경기도")
  private String province;

  @ApiModelProperty(value = "시", notes = "시를 입력하세요.", required = true, example = "성남시")
  @NotBlank(message = "{postCreateRequest.content.notBlank}")
  private String city;
}
