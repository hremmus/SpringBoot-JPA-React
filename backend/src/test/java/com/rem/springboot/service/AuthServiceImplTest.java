package com.rem.springboot.service;

import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import java.util.List;
import java.util.Optional;
import javax.management.relation.RoleNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.LoginFailureException;
import com.rem.springboot.exception.RefreshTokenFailureException;
import com.rem.springboot.exception.UserEmailAlreadyExistsException;
import com.rem.springboot.exception.UserNicknameAlreadyExistsException;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.request.SignUpRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.payload.response.RefreshTokenResponse;
import com.rem.springboot.repository.RoleRepository;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.security.JwtUtils;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {
  AuthServiceImpl authService;

  @Mock
  UserRepository userRepository;

  @Mock
  RoleRepository roleRepository;

  @Mock
  PasswordEncoder passwordEncoder;

  @Mock
  JwtUtils accessTokenProvider;

  @Mock
  JwtUtils refreshTokenProvider;

  @BeforeEach
  void beforeEach() {
    authService = new AuthServiceImpl(userRepository, roleRepository, passwordEncoder,
        accessTokenProvider, refreshTokenProvider);
  }

  @Test
  void signUpTest() throws RoleNotFoundException {
    // given
    SignUpRequest request = new SignUpRequest("user@email.com", "password", "nickname");
    given(roleRepository.findByName(ERole.ROLE_USER)).willReturn(Optional.of(new Role(ERole.ROLE_USER)));

    // when
    authService.signUp(request);

    // then
    verify(passwordEncoder).encode(request.getPassword());
    verify(userRepository).save(any());
  }

  @Test
  void validateSignUpByDuplicateEmailTest() {
    // given
    given(userRepository.existsByEmail(anyString())).willReturn(true);

    // when, then
    assertThatThrownBy(() -> authService.signUp(new SignUpRequest("user@email.com", "password", "nickname")))
    .isInstanceOf(UserEmailAlreadyExistsException.class);
  }

  @Test
  void validateSignUpByDuplicateNicknameTest() {
    // given
    given(userRepository.existsByNickname(anyString())).willReturn(true);

    // when, then
    assertThatThrownBy(() -> authService.signUp(new SignUpRequest("user@email.com", "password", "nickname")))
    .isInstanceOf(UserNicknameAlreadyExistsException.class);
  }

  @Test
  void signUpRoleNotFoundTest() {
    // given
    given(roleRepository.findByName(ERole.ROLE_USER)).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> authService.signUp(new SignUpRequest("user@email.com", "password", "nickname")))
    .isInstanceOf(RoleNotFoundException.class);
  }

  @Test
  void loginTest() {
    // given
    given(userRepository.findByEmail(any()))
    .willReturn(Optional.of(new User("user@email.com", "password", "nickname", emptyList())));
    given(passwordEncoder.matches(anyString(), anyString())).willReturn(true);
    given(accessTokenProvider.createToken(any())).willReturn("access");
    given(refreshTokenProvider.createToken(any())).willReturn("refresh");

    // when
    LoginResponse response = authService.login(new LoginRequest("user@email.com", "password"));

    // then
    assertThat(response.getAccessToken()).isEqualTo("access");
    assertThat(response.getRefreshToken()).isEqualTo("refresh");
  }

  @Test
  void loginExceptionByNoneMemberTest() {
    // given
    given(userRepository.findByEmail(any())).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> authService.login(new LoginRequest("user@email.com", "password")))
    .isInstanceOf(LoginFailureException.class);
  }

  @Test
  void loginExceptionByInvalidPasswordTest() {
    // given
    given(userRepository.findByEmail(any()))
    .willReturn(Optional.of(new User("user@email.com", "password", "nickname", emptyList())));
    given(passwordEncoder.matches(anyString(), anyString())).willReturn(false);

    // when, then
    assertThatThrownBy(() -> authService.login(new LoginRequest("user@email.com", "password")))
    .isInstanceOf(LoginFailureException.class);
  }

  @Test
  void refreshTokenTest() {
    // given
    String refreshToken = "refreshToken";
    String accessToken = "accessToken";
    given(refreshTokenProvider.parse(refreshToken)).willReturn(
        Optional.of(new JwtUtils.PrivateClaims("userId", List.of("ROLE_USER"))));
    given(accessTokenProvider.createToken(any())).willReturn(accessToken);

    // when
    RefreshTokenResponse response = authService.refreshToken(refreshToken);

    // then
    assertThat(response.getAccessToken()).isEqualTo(accessToken);
  }

  @Test
  void refreshTokenExceptionByInvalidTokenTest() {
    // given
    String refreshToken = "refreshToken";
    given(refreshTokenProvider.parse(refreshToken)).willReturn(Optional.empty());

    // when, then
    assertThatThrownBy(() -> authService.refreshToken(refreshToken))
    .isInstanceOf(RefreshTokenFailureException.class);
  }

  @Test
  void logoutTest() {
    // given
    User user = new User("user@email.com", "password", "nickname", emptyList());
    user.setRefreshToken("refreshToken");
    given(userRepository.findById(anyLong())).willReturn(Optional.ofNullable(user));

    // when
    authService.logout(anyLong());

    // then
    assertThat(user.getRefreshToken()).isEqualTo("");
  }
}