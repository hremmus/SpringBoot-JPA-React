package com.rem.springboot.security;

import java.util.Date;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtHandler {
  private String type = "Bearer ";

  public String generateToken(String key, Map<String, Object> privateClaims, long maxAgeSeconds) {
    Date now = new Date();
    return type + Jwts.builder().setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + maxAgeSeconds * 1000L)).addClaims(privateClaims)
        .signWith(SignatureAlgorithm.HS256, key.getBytes()).compact();
  }

  public ResponseCookie generateJwtCookie(String token) {
    return ResponseCookie.from("refreshToken", token.replace(type, ""))
        .path("/api").maxAge(24 * 60 * 60 * 7).httpOnly(true).build();
  }

  public Optional<Claims> parse(String key, String token) {
    String target = token;
    if (token.contains(type)) target = untype(token);
    return Optional.of(Jwts.parser().setSigningKey(key.getBytes()).parseClaimsJws(target).getBody());
  }

  private String untype(String token) {
    return token.substring(type.length());
  }
}
