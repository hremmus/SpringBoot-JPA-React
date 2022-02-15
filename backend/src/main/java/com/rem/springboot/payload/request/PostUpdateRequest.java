package com.rem.springboot.payload.request;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostUpdateRequest {
  @NotBlank
  private String title;

  @NotBlank
  private String content;

  private List<MultipartFile> addedImages = new ArrayList<>();

  private List<Long> deletedImages = new ArrayList<>();
}
