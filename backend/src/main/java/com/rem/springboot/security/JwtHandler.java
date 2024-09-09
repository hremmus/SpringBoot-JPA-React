package com.rem.springboot.security;

import java.util.Date;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtHandler {
  private String type = "Bearer ";

  public String generateToken(String key, Map<String, Object> privateClaims, long maxAgeSeconds) {
    Date now = new Date();

    JwtBuilder jwtBuilder = Jwts.builder()
        .issuedAt(now)
        .expiration(new Date(now.getTime() + maxAgeSeconds * 1000L))
        .signWith(Keys.hmacShaKeyFor(key.getBytes()));;

    for (Map.Entry<String, Object> entry : privateClaims.entrySet()) {
      jwtBuilder.claim(entry.getKey(), entry.getValue());
    }

    return type + jwtBuilder.compact();
  }

  public ResponseCookie generateJwtCookie(String token) {
    return ResponseCookie.from("refreshToken", token.replace(type, ""))
        .path("/api")
        .maxAge(24 * 60 * 60 * 7)
        .httpOnly(true)
        .build();
  }

  public Optional<Claims> parse(String key, String token) {
    String target = token;
    if (token.contains(type)) target = untype(token);
    return Optional.of(Jwts.parser()
        .verifyWith(Keys.hmacShaKeyFor(key.getBytes()))
        .build()
        .parseSignedClaims(target)
        .getPayload());
  }

  private String untype(String token) {
    return token.substring(type.length());
  }
}
