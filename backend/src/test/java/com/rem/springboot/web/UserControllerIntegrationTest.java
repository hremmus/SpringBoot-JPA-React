package com.rem.springboot.web;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import com.rem.springboot.TestInitDB;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.service.AuthServiceImpl;

@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {
  @Autowired
  WebApplicationContext context;

  @Autowired
  MockMvc mockMvc;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  UserRepository userRepository;

  @Autowired
  AuthServiceImpl authService;

  @Autowired
  TestInitDB initDB;

  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();

    initDB.init();
  }

  @Test
  void readTest() throws Exception {
    // given
    User user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);

    // when, then
    mockMvc.perform(
        get("/api/user/{id}", user.getId()))
    .andExpect(status().isOk());
  }

  @Test
  void deleteTest() throws Exception {
    // given
    User user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());
  }

  @Test
  void deleteByAdminTest() throws Exception {
    // given
    User user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
    LoginResponse adminLoginReponse = authService.login(new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", adminLoginReponse.getAccessToken()))
    .andExpect(status().isOk());
  }

  @Test
  void deleteUnauthorizedByNoneTokenTest() throws Exception {
    // given
    User user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void deleteAccessDeniedByNotResourceOwnerTest() throws Exception {
    // given
    User user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
    LoginResponse attackerLoginResponse = authService.login(new LoginRequest(initDB.getUser2Email(), initDB.getPassword()));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", attackerLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }

  @Test
  void deleteUnauthorizedByRefreshTokenTest() throws Exception {
    // given
    User user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", user.getId()).header("Authorization", loginResponse.getRefreshToken()))
    .andExpect(status().isUnauthorized());
  }
}
