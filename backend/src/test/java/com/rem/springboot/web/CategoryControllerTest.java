package com.rem.springboot.web;

import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import com.rem.springboot.payload.request.CategoryCreateRequest;
import com.rem.springboot.service.CategoryServiceImpl;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {
  @InjectMocks
  CategoryController categoryController;
  @Mock
  CategoryServiceImpl categoryService;
  MockMvc mockMvc;
  ObjectMapper objectMapper = new ObjectMapper();

  @BeforeEach
  void beforeEach() {
    mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();
  }

  @Test
  void readAllTest() throws Exception {
    // given, when, then
    mockMvc.perform(get("/api/categories"))
    .andExpect(status().isOk());
    verify(categoryService).readAll();
  }

  @Test
  void createTest() throws Exception {
    // given
    CategoryCreateRequest request = new CategoryCreateRequest("category", null);

    // when, then
    mockMvc.perform(
        post("/api/categories")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated());

    verify(categoryService).create(refEq(request));
  }

  @Test
  void deleteTest() throws Exception {
    // given
    Long id = 1L;

    // when, then
    mockMvc.perform(
        delete("/api/categories/{id}", id))
    .andExpect(status().isOk());
    verify(categoryService).delete(id);
  }
}
