package com.rem.springboot.web;

import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
import com.rem.springboot.payload.request.CommentReadCondition;
import com.rem.springboot.payload.request.CommentUpdateRequest;
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

  @Test
  void readAllTest() throws Exception {
    // given
    CommentReadCondition condition = new CommentReadCondition(1L);

    // when, then
    mockMvc.perform(
        get("/api/comments")
        .param("postId", String.valueOf(condition.getPostId())))
    .andExpect(status().isOk());

    verify(commentService).readAll(refEq(condition));
  }

  @Test
  void updateTest() throws Exception {
    // given
    CommentUpdateRequest request = new CommentUpdateRequest("updated content");

    // when, then
    mockMvc.perform(
        patch("/api/comments/{id}", 1L)
        .contentType(MediaType.APPLICATION_JSON)
        .content(new ObjectMapper().writeValueAsString(request.getContent())))
    .andExpect(status().isOk());
  }

  @Test
  void deleteTest() throws Exception {
    // given
    Long id = 1L;

    // when, then
    mockMvc.perform(
        delete("/api/comments/{id}", id))
    .andExpect(status().isOk());

    verify(commentService).delete(id);
  }
}
