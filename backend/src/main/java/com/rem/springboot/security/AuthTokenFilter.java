package com.rem.springboot.security;

import java.io.IOException;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  private final UserDetailsServiceImpl userDetailsService;

  @Override
  public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    extractToken(request).map(userDetailsService::loadUserByUsername).ifPresent(this::setAuthentication);
    chain.doFilter(request, response);
  }

  private void setAuthentication(UserDetailsImpl userDetails) {
    SecurityContextHolder.getContext().setAuthentication(new AuthenticationToken(userDetails, userDetails.getAuthorities()));
  }

  private Optional<String> extractToken(ServletRequest request) {
    return Optional.ofNullable(((HttpServletRequest) request).getHeader("Authorization"));
  }
}