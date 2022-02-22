package com.rem.springboot.security.guard;

import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.repository.CommentRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentGuard extends Guard{
  private final CommentRepository commentRepository;
  private final List<ERole> eRoles = List.of(ERole.ROLE_ADMIN);

  @Override
  protected List<ERole> getERoles() {
    return eRoles;
  }

  @Override
  public boolean isResourceOwner(Long id) {
    return commentRepository.findById(id)
        .map(comment -> comment.getUser())
        .map(user -> user.getId())
        .filter(userId -> userId.equals(AuthHelper.extractUserId()))
        .isPresent();
  }
}
