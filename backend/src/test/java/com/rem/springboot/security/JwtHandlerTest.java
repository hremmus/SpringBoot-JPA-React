package com.rem.springboot.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.util.Map;
import org.junit.jupiter.api.Test;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;

class JwtHandlerTest {
  JwtHandler jwtHandler = new JwtHandler();

  @Test
  void createTokenTest() {
    // given, when
    String key = "myKey";
    String token = createToken(key, Map.of(), 60L);

    // then
    assertThat(token).contains("Bearer ");
  }

  @Test
  void parseTest() {
    // given
    String key = "key";
    String value = "value";
    String token = createToken(key, Map.of(key, value), 60L);

    // when
    Claims claims = jwtHandler.parse(key, token).orElseThrow(RuntimeException::new);

    // then
    assertThat(claims.get(key)).isEqualTo(value);
  }

  @Test
  void parseByInvalidKeyTest() {
    // given
    String token = createToken("myKey", Map.of(), 60L);

    // when & when
    assertThrows(SignatureException.class, () -> {
      jwtHandler.parse("invalidKey", token);
    });
  }

  @Test
  void parseByExpiredTokenTest() {
    // given
    String key = "myKey";
    String token = createToken(key, Map.of(), 0L);

    // when & then
    assertThrows(ExpiredJwtException.class, () -> {
      jwtHandler.parse(key, token);
    });
  }

  private String createToken(String key, Map<String, Object> claims, long maxAgeSeconds) {
    return jwtHandler.generateToken(key, claims, maxAgeSeconds);
  }
}
