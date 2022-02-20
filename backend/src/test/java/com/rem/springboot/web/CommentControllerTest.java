package com.rem.springboot.web;

import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.rem.springboot.payload.request.CommentCreateRequest;
import com.rem.springboot.service.CommentServiceImpl;

@ExtendWith(MockitoExtension.class)
class CommentControllerTest {
  @InjectMocks
  CommentController commentController;

  @Mock
  CommentServiceImpl commentService;

  MockMvc mockMvc;
  ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void beforeEach() {
    mockMvc = MockMvcBuilders.standaloneSetup(commentController).build();
  }

  @Test
  void createTest() throws Exception {
    // given
    CommentCreateRequest request = new CommentCreateRequest("content", 1L, null, null);

    // when, then
    mockMvc.perform(
        post("/api/comments")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated());

    verify(commentService).create(refEq(request));
  }
}
