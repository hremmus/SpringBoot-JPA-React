package com.rem.springboot.security.guard;

import java.util.List;
import com.rem.springboot.entity.ERole;

public abstract class Guard {
  public final boolean check(Long id) {
    return hasRole(getERoles()) || isResourceOwner(id);
  }

  abstract protected List<ERole> getERoles();
  abstract protected boolean isResourceOwner(Long id);

  private boolean hasRole(List<ERole> eRoles) {
    return eRoles.stream().allMatch(eRole -> AuthHelper.extractUserRoles().contains(eRole));
  }
}
