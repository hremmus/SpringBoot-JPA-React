package com.rem.springboot.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rem.springboot.TestInitDB;
import com.rem.springboot.entity.Category;
import com.rem.springboot.payload.request.CategoryCreateRequest;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.repository.CategoryRepository;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.service.AuthServiceImpl;

@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class CategoryControllerIntegrationTest {
  @Autowired
  WebApplicationContext context;

  @Autowired
  MockMvc mockMvc;

  @Autowired
  TestInitDB initDB;

  @Autowired
  CategoryRepository categoryRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  AuthServiceImpl authService;

  ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();

    initDB.init();
  }

  @Test
  void readAllTest() throws Exception {
    // given, when, then
    mockMvc.perform(
        get("/api/categories"))
    .andExpect(status().isOk());
  }

  @Test
  void createTest() throws Exception {
    // given
    CategoryCreateRequest request = new CategoryCreateRequest("category", null);
    LoginResponse adminLoginRespone = authService.login(
        new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));
    int beforeSize = categoryRepository.findAll().size();

    // when, then
    mockMvc.perform(
        post("/api/categories")
        .header("Authorization", adminLoginRespone.getAccessToken())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated());

    List<Category> result = categoryRepository.findAll();
    assertThat(result.size()).isEqualTo(beforeSize + 1);
  }

  @Test
  void createUnauthorizedByNoneTokenTest() throws Exception {
    // given
    CategoryCreateRequest request = new CategoryCreateRequest("category", null);

    // when, then
    mockMvc.perform(
        post("/api/categories")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void createAccessDeniedByNormalUserTest() throws Exception {
    // given
    CategoryCreateRequest request = new CategoryCreateRequest("category", null);
    LoginResponse normalUserLoginResponse = authService.login(
        new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));

    // when, then
    mockMvc.perform(
        post("/api/categories")
        .header("Authorization", normalUserLoginResponse.getAccessToken())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isForbidden());
  }

  @Test
  void deleteTest() throws Exception {
    // given
    Long id = categoryRepository.findAll().get(0).getId();
    LoginResponse adminLoginResponse = authService.login(new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));

    // when, then
    mockMvc.perform(delete("/api/categories/{id}", id)
        .header("Authorization", adminLoginResponse.getAccessToken()))
    .andExpect(status().isOk());

    List<Category> result = categoryRepository.findAll();
    assertThat(result.size()).isEqualTo(0);
  }

  @Test
  void deleteUnauthorizedByNoneTokenTest() throws Exception {
    // given
    Long id = categoryRepository.findAll().get(0).getId();

    // when, then
    mockMvc.perform(delete("/api/categories/{id}", id))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void deleteAccessDeniedByNormalMemberTest() throws Exception {
    // given
    Long id = categoryRepository.findAll().get(0).getId();
    LoginResponse normalUserLoginResponse = authService.login(
        new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));

    // when, then
    mockMvc.perform(delete("/api/categories/{id}", id)
        .header("Authorization", normalUserLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }
}
