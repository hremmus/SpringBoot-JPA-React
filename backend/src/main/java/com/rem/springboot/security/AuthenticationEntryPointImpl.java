package com.rem.springboot.security;

import static javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import java.io.IOException;
import java.util.function.Supplier;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import com.rem.springboot.exception.ExpiredTokenException;
import io.jsonwebtoken.ExpiredJwtException;

@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
  @Autowired
  // spring boot에서 자동으로 구성되는 예외 처리 구현체인 ErrorAttributes와 혼동이 발생하지 않도록 명시해 주어야 함
  @Qualifier("handlerExceptionResolver")
  private HandlerExceptionResolver resolver;

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException authException) throws IOException, ServletException {
    Exception exception = (Exception) request.getAttribute("JwtException");
    if (exception instanceof ExpiredJwtException) {
      Supplier<ExpiredTokenException> exceptionSupplier = ExpiredTokenException::new;
      resolver.resolveException(request, response, null, exceptionSupplier.get());
    } else {
      response.sendError(SC_UNAUTHORIZED);
    }
  }
}
