package com.rem.springboot.dto;

import static java.util.stream.Collectors.toList;
import java.util.List;
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
  private List<ImageDto> images;

  public static PostDto toDto(Post post) {
    return new PostDto(post.getId(), post.getTitle(), post.getContent(), UserDto.toDto(post.getUser()),
        post.getImages().stream().map(i -> ImageDto.toDto(i)).collect(toList()));
  }
}
