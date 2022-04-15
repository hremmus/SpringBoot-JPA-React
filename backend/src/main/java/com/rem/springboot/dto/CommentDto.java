package com.rem.springboot.dto;

import static java.util.stream.Collectors.toList;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.rem.springboot.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentDto {
  private Long id;
  private String content;
  private UserDto user;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss",
      timezone = "Asia/Seoul")
  private LocalDateTime createdDate;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss",
      timezone = "Asia/Seoul")
  private LocalDateTime modifiedDate;
  private List<CommentDto> children;

  public static List<CommentDto> toDtoList(List<Comment> comments) {
    HierarchicalStructureConverter converter = HierarchicalStructureConverter.newInstance(comments,
        c -> new CommentDto(c.getId(), c.isDeleted() ? null : c.getContent(),
            c.isDeleted() ? null : UserDto.toDto(c.getUser()), c.getCreatedDate(),
            c.getModifiedDate(), new ArrayList<>()),
        c -> c.getParent(), c -> c.getId(), d -> d.getChildren());
    return converter.convert();
  }

  public static CommentDto toDto(Comment comment) {
    return new CommentDto(comment.getId(), comment.getContent(), UserDto.toDto(comment.getUser()),
        comment.getCreatedDate(), comment.getModifiedDate(),
        comment.getChildren().stream().map(c -> CommentDto.toDto(c)).collect(toList()));
  }
}
