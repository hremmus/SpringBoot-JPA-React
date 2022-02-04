package com.rem.springboot.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
import com.rem.springboot.dto.UserDto;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
  @InjectMocks
  UserServiceImpl userService;

  @Mock
  UserRepository userRepository;

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
}
