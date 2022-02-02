package com.rem.springboot.security;

import static java.util.stream.Collectors.joining;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  private final JwtHandler jwtHandler;
  private final String key;
  private final long maxAgeSeconds;

  private static final String SEP = ",";
  private static final String ROLE_TYPES = "ROLE_TYPES";
  private static final String USER_ID = "USER_ID";

  public String createToken(PrivateClaims privateClaims) {
    return jwtHandler.createToken(
        key,
        Map.of(USER_ID, privateClaims.getUserId(), ROLE_TYPES, privateClaims.getRoles().stream().collect(joining(SEP))),
        maxAgeSeconds
        );
  }

  public Optional<PrivateClaims> parse(String token) {
    return jwtHandler.parse(key, token).map(this::convert);
  }

  private PrivateClaims convert(Claims claims) {
    return new PrivateClaims(
        claims.get(USER_ID, String.class),
        Arrays.asList(claims.get(ROLE_TYPES, String.class).split(SEP)));
  }

  @Getter
  @AllArgsConstructor
  public static class PrivateClaims {
    private String userId;
    private List<String> roles;
  }
}
