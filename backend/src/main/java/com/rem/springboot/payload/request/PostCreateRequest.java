package com.rem.springboot.payload.request;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.PositiveOrZero;
import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostCreateRequest {
  @NotBlank
  private String title;

  @NotBlank
  private String content;

  @Null
  private Long userId;

  @NotNull
  @PositiveOrZero
  private Long categoryId;

  private List<MultipartFile> images = new ArrayList<>();
}
