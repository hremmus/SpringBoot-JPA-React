package com.rem.springboot.web;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rem.springboot.dto.UserDto;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.request.SignUpRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.payload.response.RefreshTokenResponse;
import com.rem.springboot.security.JwtUtils;
import com.rem.springboot.service.AuthServiceImpl;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
  @InjectMocks
  AuthController authController;

  @Mock
  AuthServiceImpl authService;
  
  @Mock
  JwtUtils refreshTokenProvider;

  MockMvc mockMvc;

  ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void beforeEach() {
    mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
  }

  @Test
  void signUpTest() throws Exception {
    // given
    SignUpRequest request = new SignUpRequest("user@email.com", "123456a!", "nickname");

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
    Set<String> userRoles = new HashSet<>(); 
    userRoles.add("ROLE_USER");
    given(authService.login(request)).willReturn(new LoginResponse(new UserDto(1L, "user@email.com", "nickname", userRoles), "access", "refresh"));
    ResponseCookie mockJwtCookie = ResponseCookie.from("refreshToken", "refresh")
        .path("/")
        .httpOnly(true)
        .build();
    given(refreshTokenProvider.createJwtCookie(anyString())).willReturn(mockJwtCookie);

    // when, then
    mockMvc.perform(
        post("/api/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.result.data.accessToken").value("access"))
    .andExpect(jsonPath("$.result.data.refreshToken").doesNotExist())
    .andExpect(header().string(HttpHeaders.SET_COOKIE, mockJwtCookie.toString()));

    verify(authService).login(request);
  }

  @Test
  void ignoreNullValueInJsonResponseTest() throws Exception {
    // given
    SignUpRequest request = new SignUpRequest("user@email.com", "123456a!", "nickname");

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
        .cookie(new javax.servlet.http.Cookie("refreshToken", "refreshToken")))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.result.data.accessToken").value("accessToken"));
  }
}