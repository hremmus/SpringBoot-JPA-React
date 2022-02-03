package com.rem.springboot.exception;

import javax.management.relation.RoleNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.rem.springboot.dto.Response;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class ExceptionAdvice {
  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public Response exception(Exception e) {
    log.info("e = {}", e.getMessage());
    return Response.failure(-1000, "오류가 발생하였습니다.");
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Response methodArgumentNotValidException(MethodArgumentNotValidException e) {
    return Response.failure(-1003, e.getBindingResult().getFieldError().getDefaultMessage());
  }

  @ExceptionHandler(LoginFailureException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public Response loginFailureException() {
    return Response.failure(-1004, "로그인에 실패하였습니다.");
  }

  @ExceptionHandler(UserEmailAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Response memberEmailAlreadyExistsException(UserEmailAlreadyExistsException e) {
    return Response.failure(-1005, e.getMessage() + "은(는) 중복된 이메일입니다.");
  }

  @ExceptionHandler(UserNicknameAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public Response memberNicknameAlreadyExistsException(UserNicknameAlreadyExistsException e) {
    return Response.failure(-1006, e.getMessage() + "은(는) 중복된 닉네임입니다.");
  }

  @ExceptionHandler(UserNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response memberNotFoundException() {
    return Response.failure(-1007, "요청한 회원을 찾을 수 없습니다.");
  }

  @ExceptionHandler(RoleNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response roleNotFoundException() {
    return Response.failure(-1008, "요청한 권한 등급을 찾을 수 없습니다.");
  }

  @ExceptionHandler(RefreshTokenFailureException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Response refreshTokenFailureException() {
    return Response.failure(-1009, "토큰 재발급에 실패하였습니다.");
  }
}