package com.rem.springboot.dto;

import static java.util.stream.Collectors.toList;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import com.rem.springboot.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostDto {
  private Long id;
  private String title;
  private String content;
  private UserDto user;
  private Long categoryId;
  private List<ImageDto> images;

  @JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private LocalDateTime createdDate;
  @JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private LocalDateTime modifiedDate;

  public static PostDto toDto(Post post) {
    return new PostDto(post.getId(), post.getTitle(), post.getContent(), UserDto.toDto(post.getUser()),
        post.getCategory().getId(), post.getImages().stream().map(i -> ImageDto.toDto(i)).collect(toList()),
        post.getCreatedDate(), post.getModifiedDate());
  }
}
