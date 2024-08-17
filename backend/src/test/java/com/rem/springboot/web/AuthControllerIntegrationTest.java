package com.rem.springboot.web;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
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
class AuthControllerIntegrationTest {
  @Autowired
  WebApplicationContext context;

  @Autowired
  MockMvc mockMvc;

  @Autowired
  TestInitDB initDB;
  
  @Autowired
  UserRepository userRepository;
  
  @Autowired
  AuthServiceImpl authService;
  
  User user;
  
  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    initDB.init();
    user = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
  }
  
  @Test
  void logoutTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    
    // when, then
    mockMvc.perform(
        get("/api/auth/signout")
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isNoContent());
  }
}
