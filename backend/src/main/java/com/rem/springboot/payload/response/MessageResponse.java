package com.rem.springboot.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class MessageResponse {
  private String message;

  public static MessageResponse whitMessage(String message) {
    return new MessageResponse(message);
  }
}