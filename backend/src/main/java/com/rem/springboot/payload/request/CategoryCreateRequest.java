package com.rem.springboot.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryCreateRequest {
  @NotBlank
  @Size(min = 2, max = 30)
  private String name;

  private Long parentId;
}
