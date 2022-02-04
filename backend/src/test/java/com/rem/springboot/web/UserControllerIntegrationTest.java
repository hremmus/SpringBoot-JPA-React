package com.rem.springboot.web;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.List;
import javax.management.relation.RoleNotFoundException;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.repository.RoleRepository;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.service.AuthServiceImpl;

@Transactional
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {
  @Autowired
  WebApplicationContext context;

  @Autowired
  MockMvc mockMvc;

  @Autowired
  EntityManager em;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  AuthServiceImpl authService;

  @BeforeEach
  void beforeEach() throws RoleNotFoundException {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();

    roleRepository.saveAll(List.of(new Role(ERole.ROLE_USER), new Role(ERole.ROLE_ADMIN)));
    userRepository.saveAll(List.of(
        new User("user1@email.com", passwordEncoder.encode("password"), "nickname1", List.of(
            roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new))),
        new User("user2@email.com", passwordEncoder.encode("password"), "nickname2", List.of(
            roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new))),
        new User("admin@email.com", passwordEncoder.encode("password"), "admin", List.of(
            roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new),
            roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(RoleNotFoundException::new)))));

    em.flush();
    em.clear();
  }

  @Test
  void readTest() throws Exception {
    // given
    User user = userRepository.findByEmail("user1@email.com").orElseThrow(UserNotFoundException::new);

    // when, then
    mockMvc.perform(
        get("/api/user/{id}", user.getId()))
    .andExpect(status().isOk());
  }

  @Test
  void deleteTest() throws Exception {
    // given
    User user = userRepository.findByEmail("user1@email.com").orElseThrow(UserNotFoundException::new);
    LoginResponse loginResponse = authService.login(new LoginRequest("user1@email.com", "password"));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());
  }

  @Test
  void deleteByAdminTest() throws Exception {
    // given
    User user = userRepository.findByEmail("user1@email.com").orElseThrow(UserNotFoundException::new);
    LoginResponse adminLoginReponse = authService.login(new LoginRequest("admin@email.com",  "password"));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", adminLoginReponse.getAccessToken()))
    .andExpect(status().isOk());
  }

  @Test
  void deleteUnauthorizedByNoneTokenTest() throws Exception {
    // given
    User user = userRepository.findByEmail("user1@email.com").orElseThrow(UserNotFoundException::new);

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void deleteAccessDeniedByNotResourceOwnerTest() throws Exception {
    // given
    User user = userRepository.findByEmail("user1@email.com").orElseThrow(UserNotFoundException::new);
    LoginResponse attackerLoginResponse = authService.login(new LoginRequest("user2@email.com", "password"));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", attackerLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }

  @Test
  void deleteUnauthorizedByRefreshTokenTest() throws Exception {
    // given
    User user = userRepository.findByEmail("user1@email.com").orElseThrow(UserNotFoundException::new);
    LoginResponse loginResponse = authService.login(new LoginRequest("user1@email.com", "password"));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", loginResponse.getRefreshToken()))
    .andExpect(status().isUnauthorized());
  }
}
