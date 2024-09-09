package com.rem.springboot.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.util.Map;
import org.junit.jupiter.api.Test;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;

class JwtHandlerTest {
  JwtHandler jwtHandler = new JwtHandler();

  @Test
  void createTokenTest() {
    // given, when
    String key = "this-is-a-key-for-json-web-token";
    String token = createToken(key, Map.of(), 60L);

    // then
    assertThat(token).contains("Bearer ");
  }

  @Test
  void parseTest() {
    // given
    String key = "this-is-a-key-for-json-web-token";
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
    String token = createToken("this-is-a-key-for-json-web-token", Map.of(), 60L);

    // when & when
    assertThrows(SignatureException.class, () -> {
      jwtHandler.parse("this-is-a-invalid-key-for-json-web-token-test", token);
    });
  }

  @Test
  void parseByExpiredTokenTest() {
    // given
    String key = "this-is-a-key-for-json-web-token";
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
