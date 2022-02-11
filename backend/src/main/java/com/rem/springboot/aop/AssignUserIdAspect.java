package com.rem.springboot.aop;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Optional;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import com.rem.springboot.security.guard.AuthHelper;

@Aspect
@Component
public class AssignUserIdAspect {
  @Before("@annotation(com.rem.springboot.aop.AssignUserId)")
  public void assignUserId(JoinPoint joinPoint) {
    Arrays.stream(joinPoint.getArgs())
    .forEach(arg -> getMethod(arg.getClass(), "setUserId")
        .ifPresent(setUserId -> invokeMethod(arg, setUserId, AuthHelper.extractUserId())));
  }

  private Optional<Method> getMethod(Class<?> clazz, String methodName) {
    try {
      return Optional.of(clazz.getMethod(methodName, Long.class));
    } catch (NoSuchMethodException e) {
      return Optional.empty();
    }
  }

  private void invokeMethod(Object obj, Method method, Object... args) {
    try {
      method.invoke(obj, args);
    } catch (ReflectiveOperationException e) {
      throw new RuntimeException(e);
    }
  }
}
