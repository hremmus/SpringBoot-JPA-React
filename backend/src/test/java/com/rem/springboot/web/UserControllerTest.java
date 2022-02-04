package com.rem.springboot.web;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.rem.springboot.service.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {
  @InjectMocks
  UserController userController;

  @Mock
  UserServiceImpl userService;

  MockMvc mockMvc;

  @BeforeEach
  void beforeEach() {
    mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
  }

  @Test
  void readTest() throws Exception {
    // given
    Long id = 1L;

    // when, then
    mockMvc.perform(
        get("/api/user/{id}", id))
    .andExpect(status().isOk());

    verify(userService).read(id);
  }

  @Test
  void deleteTest() throws Exception {
    // given
    Long id = 1L;

    // when, then
    mockMvc.perform(
        delete("/api/user/{id}", id))
    .andExpect(status().isOk());

    verify(userService).delete(id);
  }
}
