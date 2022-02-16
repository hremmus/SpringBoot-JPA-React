package com.rem.springboot.security.guard;

import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.repository.PostRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostGuard extends Guard {
  private final PostRepository postRepository;
  private List<ERole> eRoles = List.of(ERole.ROLE_ADMIN);

  @Override
  protected List<ERole> getERoles() {
    return eRoles;
  }

  @Override
  protected boolean isResourceOwner(Long id) {
    return postRepository.findById(id)
        .map(post -> post.getUser())
        .map(user -> user.getId())
        .filter(userId -> userId.equals(AuthHelper.extractUserId()))
        .isPresent();
  }
}
