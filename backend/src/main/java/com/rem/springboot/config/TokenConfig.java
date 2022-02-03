package com.rem.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.rem.springboot.security.JwtHandler;
import com.rem.springboot.security.JwtUtils;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class TokenConfig {
  private final JwtHandler jwtHandler;

  @Bean
  public JwtUtils accessTokenProvider(
      @Value("${jwt.key.access}") String key,
      @Value("${jwt.max-age.access}") long maxAgeSeconds) {
    return new JwtUtils(jwtHandler, key, maxAgeSeconds);
  }

  @Bean
  public JwtUtils refreshTokenProvider(
      @Value("${jwt.key.refresh}") String key,
      @Value("${jwt.max-age.refresh}") long maxAgeSeconds) {
    return new JwtUtils(jwtHandler, key, maxAgeSeconds);
  }
}
