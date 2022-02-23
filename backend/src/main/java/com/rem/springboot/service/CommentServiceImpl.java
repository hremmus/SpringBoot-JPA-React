package com.rem.springboot.service;

import java.util.List;
import java.util.Optional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.dto.CommentDto;
import com.rem.springboot.entity.Comment;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CommentNotFoundException;
import com.rem.springboot.exception.PostNotFoundException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.CommentCreateRequest;
import com.rem.springboot.payload.request.CommentReadCondition;
import com.rem.springboot.payload.request.CommentUpdateRequest;
import com.rem.springboot.payload.response.CommentUpdateResponse;
import com.rem.springboot.repository.CommentRepository;
import com.rem.springboot.repository.PostRepository;
import com.rem.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl {
  private final CommentRepository commentRepository;
  private final UserRepository userRepository;
  private final PostRepository postRepository;

  @Transactional
  public void create(CommentCreateRequest request) {
    User user = userRepository.findById(request.getUserId()).orElseThrow(UserNotFoundException::new);
    Post post = postRepository.findById(request.getPostId()).orElseThrow(PostNotFoundException::new);
    Comment parent = Optional.ofNullable(request.getParentId())
        .map(id -> commentRepository.findById(id).orElseThrow(CommentNotFoundException::new))
        .orElse(null);

    commentRepository.save(new Comment(request.getContent(), user, post, parent));
  }

  public List<CommentDto> readAll(CommentReadCondition condition) {
    return CommentDto.toDtoList(
        commentRepository.findAllWithUserAndParentByPostIdOrderByParentIdAscNullsFirstCommentIdAsc(condition.getPostId()));
  }

  @Transactional
  @PreAuthorize("@commentGuard.isResourceOwner(#id)")
  public CommentUpdateResponse update(Long id, CommentUpdateRequest request) {
    Comment comment = commentRepository.findById(id).orElseThrow(CommentNotFoundException::new);
    comment.update(request.getContent());
    return new CommentUpdateResponse(id);
  }

  @Transactional
  @PreAuthorize("@commentGuard.check(#id)")
  public void delete(Long id) {
    Comment comment = commentRepository.findById(id).orElseThrow(CommentNotFoundException::new);
    comment.findDeletableComment().ifPresentOrElse(commentRepository::delete, comment::delete);
  }
}
