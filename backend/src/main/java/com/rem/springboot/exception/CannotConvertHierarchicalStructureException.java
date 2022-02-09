package com.rem.springboot.exception;

public class CannotConvertHierarchicalStructureException extends RuntimeException {
  public CannotConvertHierarchicalStructureException(String message) {
    super(message);
  }
}
