package com.rem.springboot.security;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtUtilsTest {
  JwtUtils jwtUtils;

  @BeforeEach
  void beforeEach() {
    jwtUtils = new JwtUtils(new JwtHandler(),"this-is-a-key-for-json-web-token", 1000L);
  }

  @Test
  void createTokenAndParseTest() {
    // given
    String userId = "1";
    List<String> roleTypes = List.of("USER", "ADMIN");
    JwtUtils.PrivateClaims privateClaims = new JwtUtils.PrivateClaims(userId, roleTypes);

    // when
    String token = jwtUtils.createToken(privateClaims);

    // then
    JwtUtils.PrivateClaims parsedPrivateClaims = jwtUtils.parse(token).orElseThrow(RuntimeException::new);
    assertThat(parsedPrivateClaims.getUserId()).isEqualTo(userId);
    assertThat(parsedPrivateClaims.getRoles()).contains(roleTypes.get(0), roleTypes.get(1));
  }
}
