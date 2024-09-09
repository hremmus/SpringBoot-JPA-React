package com.rem.springboot.security;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
  @Qualifier("accessTokenProvider")
  private final JwtUtils accessTokenProvider;

  @Override
  public UserDetailsImpl loadUserByUsername(String token) throws UsernameNotFoundException {
    return accessTokenProvider.parse(token)
        .map(this::convert)
        .orElse(null);
  }

  private UserDetailsImpl convert(JwtUtils.PrivateClaims privateClaims) {
    return new UserDetailsImpl(
        privateClaims.getUserId(),
        privateClaims.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet()));
  }
}
