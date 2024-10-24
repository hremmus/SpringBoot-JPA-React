package com.rem.springboot.security;

import java.io.IOException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  private final UserDetailsServiceImpl userDetailsService;

  @Override
  public void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain) throws IOException, ServletException {
    try {
      extractToken(request).map(userDetailsService::loadUserByUsername).ifPresent(this::setAuthentication);
    } catch (JwtException e) {
      if (e instanceof MalformedJwtException) {
        // 비로그인 상태 => 예외를 던지지 않음
      } else {
        request.setAttribute("JwtException", e);
      }
    }

    chain.doFilter(request, response);
  }

  private void setAuthentication(UserDetailsImpl userDetails) {
    SecurityContextHolder.getContext().setAuthentication(new AuthenticationToken(userDetails, userDetails.getAuthorities()));
  }

  private Optional<String> extractToken(ServletRequest request) {
    return Optional.ofNullable(((HttpServletRequest) request).getHeader("Authorization"));
  }
}
