package com.rem.springboot.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import com.rem.springboot.entity.Location;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.LocationCreateRequest;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.repository.LocationRepository;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.service.AuthServiceImpl;
import com.rem.springboot.service.UserServiceImpl;

@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class SettingsControllerIntegrationTest {
  @Autowired
  WebApplicationContext context;

  @Autowired
  MockMvc mockMvc;

  @Autowired
  TestInitDB initDB;

  @Autowired
  UserRepository userRepository;

  @Autowired
  LocationRepository locationRepository;

  @Autowired
  AuthServiceImpl authService;

  @Autowired
  UserServiceImpl userService;

  User user1;

  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    initDB.init();
    user1 =
        userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
  }

  @Test
  @DisplayName("유저의 지역 정보 추가")
  void createTest() throws Exception {
    // given
    LoginResponse loginResponse =
        authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    LocationCreateRequest request = new LocationCreateRequest("", "서울특별시");

    // when, then
    mockMvc.perform(post("/api/settings/{id}/location", user1.getId())
        // .param("province", request.getProvince())
        .param("city", request.getCity()).header("Authorization", loginResponse.getAccessToken()))
        .andExpect(status().isOk());

    Location location = userRepository.findById(user1.getId())
        .orElseThrow(UserNotFoundException::new).getLocation();

    assertNull(location.getProvince());
    assertThat(location.getCity()).isEqualTo("서울특별시");
  }
}
