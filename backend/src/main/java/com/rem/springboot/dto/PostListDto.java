package com.rem.springboot.dto;

import java.util.List;
import org.springframework.data.domain.Page;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostListDto {
  private Long totalElements;
  private Integer totalPages;
  private boolean hasNext;
  private List<PostSimpleDto> posts;

  public static PostListDto toDto(Page<PostSimpleDto> page) {
    return new PostListDto(page.getTotalElements(), page.getTotalPages(), page.hasNext(), page.getContent());
  }
}
