package com.rem.springboot.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.rem.springboot.dto.UserDto;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.InvalidPasswordException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.PasswordCheckRequest;
import com.rem.springboot.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
  @InjectMocks
  UserServiceImpl userService;

  @Mock
  UserRepository userRepository;

  @Mock
  PasswordEncoder passwordEncoder;

  @Test
  void readTest() {
    // given
    User user = new User("user@email.com", "password", "nickname", List.of());
    given(userRepository.findById(anyLong())).willReturn(Optional.of(user));

    // when
    UserDto result = userService.read(1L);

    // then
    assertThat(result.getEmail()).isEqualTo(user.getEmail());
  }

  @Test
  void readExceptionByUserNotFoundTest() {
    // given
    given(userRepository.findById(any())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> userService.read(1L)).isInstanceOf(UserNotFoundException.class);
  }

  @Test
  void deleteTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(
        Optional.of(new User("user@email.com", "password", "nickname", List.of())));

    // when
    userService.delete(1L);

    // then
    verify(userRepository).delete(any());
  }

  @Test
  void deleteExceptionByUserNotFoundTest() {
    // given
    given(userRepository.findById(anyLong())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> userService.delete(1L)).isInstanceOf(UserNotFoundException.class);
  }

  @Test
  void checkCorrectPasswordTest() {
    // given
    String password = "123456a!";
    PasswordCheckRequest request = new PasswordCheckRequest(password);
    User user = new User("user@email.com", password, "nickname", List.of());
    given(userRepository.findById(anyLong())).willReturn(Optional.of(user));
    given(passwordEncoder.matches(request.getPassword(), user.getPassword())).willReturn(true);

    // when, then
    assertDoesNotThrow(() -> userService.checkPassword(1L, request));
  }

  @Test
  void checkIncorrectPasswordTest() {
    // given
    String correctPassword = "123456a!";
    String incorrectPassword = "qwert";
    PasswordCheckRequest request = new PasswordCheckRequest(incorrectPassword);
    User user = new User("user@email.com", correctPassword, "nickname", List.of());
    given(userRepository.findById(anyLong())).willReturn(Optional.of(user));
    given(passwordEncoder.matches(request.getPassword(), user.getPassword())).willReturn(false);

    // when, then
    assertThatThrownBy(() -> userService.checkPassword(1L, request)).isInstanceOf(InvalidPasswordException.class);
  }
}
