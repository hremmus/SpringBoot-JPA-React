package com.rem.springboot.security.guard;

import java.util.List;
import org.springframework.stereotype.Component;
import com.rem.springboot.entity.ERole;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserGuard extends Guard {
  private List<ERole> eRoles = List.of(ERole.ROLE_ADMIN);

  @Override
  protected List<ERole> getERoles() {
    return eRoles;
  }

  @Override
  protected boolean isResourceOwner(Long id) {
    return id.equals(AuthHelper.extractUserId());
  }
}