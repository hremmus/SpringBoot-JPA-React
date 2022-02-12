package com.rem.springboot.dto;

import com.rem.springboot.entity.Image;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ImageDto {
  private Long id;
  private String originName;
  private String uniqueName;

  public static ImageDto toDto(Image image) {
    return new ImageDto(image.getId(), image.getOriginName(), image.getUniqueName());
  }
}
