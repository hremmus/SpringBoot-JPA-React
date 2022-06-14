package com.rem.springboot.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.dto.UserDto;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.InvalidPasswordException;
import com.rem.springboot.exception.UserNicknameAlreadyExistsException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.PasswordCheckRequest;
import com.rem.springboot.payload.request.UserSearchRequest;
import com.rem.springboot.payload.request.UserUpdateRequest;
import com.rem.springboot.payload.response.UserUpdateResponse;
import com.rem.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserServiceImpl {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserDto read(Long id) {
    return UserDto.toDto(userRepository.findById(id).orElseThrow(UserNotFoundException::new));
  }
  
  public List<UserDto> readAll(UserSearchRequest request) {
    return userRepository.findAllByCondition(request.getEmail(), request.getNickname())
        .stream().map(u -> UserDto.toDto(u)).collect(Collectors.toList());
  }

  @Transactional
  @PreAuthorize("@userGuard.check(#id)")
  public void delete(Long id) {
    User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    userRepository.delete(user);
  }

  public void checkPassword(Long id, PasswordCheckRequest request) {
    User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new InvalidPasswordException();
    }
  }

  @Transactional
  public UserUpdateResponse update(Long id, UserUpdateRequest request) {
    User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    
    changeNickname(user, request.getNickname());
    if (request.getPassword() != null) user.updatePassword(passwordEncoder.encode(request.getPassword()));
    
    return new UserUpdateResponse(id);
  }
  
  private void changeNickname(User user, String nickname) {
    if (nickname == null || user.getNickname() == nickname) return;
    if (userRepository.existsByNickname(nickname)) throw new UserNicknameAlreadyExistsException(nickname);
    
    user.updateNickname(nickname);
  }
}
