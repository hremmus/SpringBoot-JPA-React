package com.rem.springboot.security;

import java.util.Collection;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class AuthenticationToken extends AbstractAuthenticationToken {
  private static final long serialVersionUID = 1L;

  public AuthenticationToken(UserDetailsImpl principal, Collection<? extends GrantedAuthority> authorities) {
    super(authorities);
    this.principal = principal;
    setAuthenticated(true);
  }

  private UserDetailsImpl principal;

  @Override
  public UserDetailsImpl getPrincipal() {
    return principal;
  }

  @Override
  public Object getCredentials() {
    throw new UnsupportedOperationException();
  }
}
