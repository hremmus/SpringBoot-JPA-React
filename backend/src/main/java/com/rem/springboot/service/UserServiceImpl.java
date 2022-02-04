package com.rem.springboot.service;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.dto.UserDto;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserServiceImpl {
  private final UserRepository userRepository;

  public UserDto read(Long id) {
    return UserDto.toDto(userRepository.findById(id).orElseThrow(UserNotFoundException::new));
  }

  @Transactional
  @PreAuthorize("@userGuard.check(#id)")
  public void delete(Long id) {
    User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    userRepository.delete(user);
  }
}
