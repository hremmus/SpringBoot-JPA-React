package com.rem.springboot.exception;

public class UserEmailAlreadyExistsException extends RuntimeException {
  public UserEmailAlreadyExistsException(String message) {
    super(message);
  }
}