package com.rem.springboot.security.guard;

import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.security.AuthenticationToken;
import com.rem.springboot.security.UserDetailsImpl;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthHelper {
  public static boolean isAuthenticated() {
    return getAuthentication() instanceof AuthenticationToken &&
        getAuthentication().isAuthenticated();
  }

  public static Long extractUserId() {
    return Long.valueOf(getUserDetails().getId());
  }

  public static Set<ERole> extractUserRoles() {
    return getUserDetails().getAuthorities()
        .stream()
        .map(authority -> authority.getAuthority())
        .map(strAuth -> ERole.valueOf(strAuth))
        .collect(Collectors.toSet());
  }

  private static UserDetailsImpl getUserDetails() {
    return (UserDetailsImpl) getAuthentication().getPrincipal();
  }

  private static Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }
}