package com.rem.springboot.exception;

public class UserNicknameAlreadyExistsException extends RuntimeException{
  public UserNicknameAlreadyExistsException(String message) {
    super(message);
  }
}