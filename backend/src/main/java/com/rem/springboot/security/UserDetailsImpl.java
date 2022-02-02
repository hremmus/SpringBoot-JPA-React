package com.rem.springboot.security;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
  private static final long serialVersionUID = 1L;

  private String id;
  @JsonIgnore
  private Set<? extends GrantedAuthority> authorities;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getUsername() {
    throw new UnsupportedOperationException();
  }

  @Override
  public String getPassword() {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean isAccountNonExpired() {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean isAccountNonLocked() {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean isEnabled() {
    throw new UnsupportedOperationException();
  }

  @Override
  public boolean equals(Object object) {
    if (this == object)
      return true;
    if (object == null || getClass() != object.getClass())
      return false;
    UserDetailsImpl user = (UserDetailsImpl) object;
    return Objects.equals(id, user.id);
  }
}
