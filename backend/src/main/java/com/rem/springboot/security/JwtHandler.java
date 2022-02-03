package com.rem.springboot.security;

import java.util.Date;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtHandler {
  private String type = "Bearer ";

  public String generateToken(String key, Map<String, Object> privateClaims, long maxAgeSeconds) {
    Date now = new Date();
    return type + Jwts.builder().addClaims(privateClaims)
        .addClaims(Map.of(Claims.ISSUED_AT, now, Claims.EXPIRATION,
            new Date(now.getTime() + maxAgeSeconds * 1000L)))
        .signWith(SignatureAlgorithm.HS256, key.getBytes()).compact();
  }

  public ResponseCookie generateJwtCookie(String token) {
    return ResponseCookie.from("refreshToken", token.replace(type, ""))
        .path("/api").maxAge(24 * 60 * 60).httpOnly(true).build();
  }

  public Optional<Claims> parse(String key, String token) {
    try {
      return Optional
          .of(Jwts.parser().setSigningKey(key.getBytes()).parseClaimsJws(untype(token)).getBody());
    } catch (JwtException e) {
      return Optional.empty();
    }
  }

  private String untype(String token) {
    return token.substring(type.length());
  }
}
