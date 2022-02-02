package com.rem.springboot.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class Response {
  private boolean success;
  private int statusCode;
  private Result result;

  public static Response success() {
    return new Response(true, 0, null);
  }

  public static <T> Response success(T data) {
    return new Response(true, 0, new Success<>(data));
  }

  public static Response failure(int statusCode, String message) {
    return new Response(false, statusCode, new Failure(message));
  }
}
