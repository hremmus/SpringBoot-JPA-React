package com.rem.springboot.dto;

import static java.util.stream.Collectors.toList;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import com.rem.springboot.entity.Category;
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
  private List<Long> categoryIds = new ArrayList<>();
  private String categoryName;
  private List<ImageDto> images;

  @JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private LocalDateTime createdDate;
  @JsonFormat(shape = Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
  private LocalDateTime modifiedDate;

  public static PostDto toDto(Post post) {
    List<Long> categoryIds = new ArrayList<>();
    Category category = post.getCategory();
    while (category != null) {
      categoryIds.add(category.getId());
      category = category.getParent();
    }
    Collections.reverse(categoryIds);

    return new PostDto(post.getId(), post.getTitle(), post.getContent(),
        UserDto.toDto(post.getUser()), categoryIds, post.getCategory().getName(),
        post.getImages().stream().map(i -> ImageDto.toDto(i)).collect(toList()),
        post.getCreatedDate(), post.getModifiedDate());
  }
}
