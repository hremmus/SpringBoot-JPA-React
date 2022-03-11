package com.rem.springboot.service;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toSet;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import javax.management.relation.RoleNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.dto.UserDto;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
import com.rem.springboot.entity.UserRole;
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
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils accessTokenProvider;
  private final JwtUtils refreshTokenProvider;

  @Transactional
  public void signUp(SignUpRequest request) throws RoleNotFoundException {
    validateSignUpInfo(request);
    String encodedPassword = passwordEncoder.encode(request.getPassword());
    User user = new User(request.getEmail(), encodedPassword, request.getNickname(), emptyList());
    Set<String> strRoles = request.getRole();
    Set<Role> roles = new HashSet<>();
    if (strRoles == null) {
      roles.add(roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new));
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "admin":
            Role adminRole;
            adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow();
            roles.add(adminRole);
            break;
          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER).orElseThrow();
            roles.add(userRole);
        }
      });
    }

    Set<UserRole> userRoles = roles.stream().map(r -> new UserRole(user, r)).collect(toSet());
    user.setRoles(userRoles);

    userRepository.save(user);
  }

  @Transactional(readOnly = true)
  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail()).orElseThrow(LoginFailureException::new);
    validatePassword(request, user);
    JwtUtils.PrivateClaims privateClaims = createPrivateClaims(user);
    String accessToken = accessTokenProvider.createToken(privateClaims);
    String refreshToken = refreshTokenProvider.createToken(privateClaims);
    return new LoginResponse(UserDto.toDto(user), accessToken, refreshToken);
  }

  public RefreshTokenResponse refreshToken(String refreshToken) {
    JwtUtils.PrivateClaims privateClaims = refreshTokenProvider.parse(refreshToken)
        .orElseThrow(RefreshTokenFailureException::new);
    return new RefreshTokenResponse(accessTokenProvider.createToken(privateClaims));
  }

  private void validateSignUpInfo(SignUpRequest request) {
    if(userRepository.existsByEmail(request.getEmail()))
      throw new UserEmailAlreadyExistsException(request.getEmail());
    if(userRepository.existsByNickname(request.getNickname()))
      throw new UserNicknameAlreadyExistsException(request.getNickname());
  }

  private void validatePassword(LoginRequest request, User user) {
    if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new LoginFailureException();
    }
  }

  private JwtUtils.PrivateClaims createPrivateClaims(User user) {
    return new JwtUtils.PrivateClaims(
        String.valueOf(user.getId()),
        user.getRoles().stream()
        .map(userRole -> userRole.getRole())
        .map(role -> role.getName())
        .map(eRole -> eRole.toString())
        .collect(Collectors.toList()));
  }
}
