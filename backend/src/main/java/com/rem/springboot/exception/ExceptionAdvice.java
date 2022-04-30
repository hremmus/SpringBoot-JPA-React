package com.rem.springboot.exception;

import javax.management.relation.RoleNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
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

  @ExceptionHandler(AccessDeniedException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public Response accessDeniedException() {
    return Response.failure(-1002, "접근이 거부되었습니다.");
  }

  @ExceptionHandler(BindException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Response bindException(BindException e) {
    return Response.failure(-1003, e.getBindingResult().getFieldError().getDefaultMessage());
  }

  @ExceptionHandler(LoginFailureException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public Response loginFailureException() {
    return Response.failure(-1004, "아이디 또는 비밀번호를 잘못 입력했습니다.");
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

  @ExceptionHandler(CategoryNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response categoryNotFoundException() {
    return Response.failure(-1010, "존재하지 않는 카테고리입니다.");
  }

  @ExceptionHandler(CannotConvertHierarchicalStructureException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public Response cannotConvertNestedStructureException(
      CannotConvertHierarchicalStructureException e) {
    log.error("e = {}", e.getMessage());
    return Response.failure(-1011, "계층형 구조 변환에 실패하였습니다.");
  }

  @ExceptionHandler(PostNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response postNotFoundException() {
    return Response.failure(-1012, "존재하지 않는 게시글입니다.");
  }

  @ExceptionHandler(UnsupportedFileFormatException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response unsupportedFileFormatException() {
    return Response.failure(-1013, "지원하지 않는 파일 형식입니다.");
  }

  @ExceptionHandler(FileUploadFailureException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response fileUploadFailureException(FileUploadFailureException e) {
    log.error("e = {}", e.getMessage());
    return Response.failure(-1014, "파일 업로드에 실패하였습니다.");
  }

  @ExceptionHandler(CommentNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response commentNotFoundException() {
    return Response.failure(-1015, "존재하지 않는 댓글입니다.");
  }

  @ExceptionHandler(LocationNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Response locationNotFoundException() {
    return Response.failure(-1016, "존재하지 않는 지역입니다.");
  }
}
