package com.rem.springboot.web;

import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.request.SignUpRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.payload.response.RefreshTokenResponse;
import com.rem.springboot.service.AuthServiceImpl;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
  @InjectMocks
  AuthController authController;

  @Mock
  AuthServiceImpl authService;

  MockMvc mockMvc;

  ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void beforeEach() {
    mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
  }

  @Test
  void signUpTest() throws Exception {
    // given
    SignUpRequest request = new SignUpRequest("user@email.com", "password", "nickname");

    // when, then
    mockMvc.perform(
        post("/api/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated());

    verify(authService).signUp(refEq(request));
  }

  @Test
  void loginTest() throws Exception {
    // given
    LoginRequest request = new LoginRequest("user@email.com", "password");
    given(authService.login(request)).willReturn(new LoginResponse("access", "refresh"));

    // when, then
    mockMvc.perform(
        post("/api/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.result.data.accessToken").value("access"))
    .andExpect(jsonPath("$.result.data.refreshToken").value(null));

    verify(authService).login(request);
  }

  @Test
  void ignoreNullValueInJsonResponseTest() throws Exception {
    // given
    SignUpRequest request = new SignUpRequest("user@email.com", "password", "nickname");

    // when, then
    mockMvc.perform(
        post("/api/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.result").doesNotExist());
  }

  @Test
  void refreshTokenTest() throws Exception {
    // given
    given(authService.refreshToken("refreshToken")).willReturn(new RefreshTokenResponse("accessToken"));

    // when, then
    mockMvc.perform(
        post("/api/auth/refreshtoken")
        .header("Authorization", "refreshToken"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.result.data.accessToken").value("accessToken"));
  }
}