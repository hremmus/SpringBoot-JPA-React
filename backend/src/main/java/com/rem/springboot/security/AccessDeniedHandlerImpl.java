package com.rem.springboot.security;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {
  @Autowired
  // spring boot에서 자동으로 구성되는 예외 처리 구현체인 ErrorAttributes와 혼동이 발생하지 않도록 명시해 주어야 함
  @Qualifier("handlerExceptionResolver")
  private HandlerExceptionResolver resolver;

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response,
      AccessDeniedException accessDeniedException) throws IOException, ServletException {
    resolver.resolveException(request, response, null, accessDeniedException);
  }
}
