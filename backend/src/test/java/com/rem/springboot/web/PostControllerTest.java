package com.rem.springboot.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.payload.request.PostCreateRequest;
import com.rem.springboot.payload.request.PostUpdateRequest;
import com.rem.springboot.service.PostServiceImpl;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {
  @InjectMocks
  PostController postController;

  @Mock
  PostServiceImpl postService;

  MockMvc mockMvc;

  @BeforeEach
  void beforeEach() {
    mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
  }

  @Test
  void createTest() throws Exception{
    // given
    ArgumentCaptor<PostCreateRequest> postCreateRequestArgumentCaptor
    = ArgumentCaptor.forClass(PostCreateRequest.class);

    List<MultipartFile> imageFiles = List.of(
        new MockMultipartFile("test1", "test1.PNG", MediaType.IMAGE_PNG_VALUE, "test1".getBytes()),
        new MockMultipartFile("test2", "test2.PNG", MediaType.IMAGE_PNG_VALUE, "test2".getBytes())
        );
    PostCreateRequest request = new PostCreateRequest("title", "content", 1L, 1L, imageFiles);

    // when, then
    mockMvc.perform(
        multipart("/api/posts")
        .file("images", imageFiles.get(0).getBytes())
        .file("images", imageFiles.get(1).getBytes())
        .param("title", request.getTitle())
        .param("content", request.getContent())
        .param("categoryId", String.valueOf(request.getCategoryId()))
        .with(requestPostProcessor -> {
          requestPostProcessor.setMethod("POST");
          return requestPostProcessor;
        })
        .contentType(MediaType.MULTIPART_FORM_DATA))
    .andExpect(status().isCreated());

    verify(postService).create(postCreateRequestArgumentCaptor.capture());

    PostCreateRequest capturedRequest = postCreateRequestArgumentCaptor.getValue();
    assertThat(capturedRequest.getImages().size()).isEqualTo(2);
  }

  @Test
  void readAllTest() throws Exception {
    // given
    PostReadCondition condition = new PostReadCondition(0, 1, List.of(1L, 2L), List.of(1L, 2L));

    // when, then
    mockMvc.perform(
        get("/api/posts")
        .param("page", String.valueOf(condition.getPage()))
        .param("size", String.valueOf(condition.getSize()))
        .param("categoryId", String.valueOf(condition.getCategoryId().get(0)), String.valueOf(condition.getCategoryId().get(1)))
        .param("userId", String.valueOf(condition.getUserId().get(0)), String.valueOf(condition.getUserId().get(1))))
    .andExpect(status().isOk());

    verify(postService).readAll(refEq(condition));
  }

  @Test
  void readTest() throws Exception {
    // given
    Long id = 1L;

    // when, then
    mockMvc.perform(
        get("/api/posts/{id}", id))
    .andExpect(status().isOk());
    verify(postService).read(id);
  }

  @Test
  void updateTest() throws Exception {
    // given
    ArgumentCaptor<PostUpdateRequest> postUpdateRequestArgumentCaptor
    = ArgumentCaptor.forClass(PostUpdateRequest.class);

    List<MultipartFile> addedImages = List.of(
        new MockMultipartFile("test1", "test1.PNG", MediaType.IMAGE_PNG_VALUE, "test1".getBytes()),
        new MockMultipartFile("test2", "test2.PNG", MediaType.IMAGE_PNG_VALUE, "test2".getBytes()));

    List<Long> deletedImages = List.of(1L, 2L);

    PostUpdateRequest request = new PostUpdateRequest("title", "content", addedImages, deletedImages);

    // when, then
    mockMvc.perform(
        multipart("/api/posts/{id}", 1L)
        .file("addedImages", addedImages.get(0).getBytes())
        .file("addedImages", addedImages.get(1).getBytes())
        .param("deletedImages", String.valueOf(deletedImages.get(0)), String.valueOf(deletedImages.get(1)))
        .param("title", request.getTitle())
        .param("content", request.getContent())
        .with(requestPostProcessor -> { requestPostProcessor.setMethod("PUT"); return requestPostProcessor; })
        .contentType(MediaType.MULTIPART_FORM_DATA))
    .andExpect(status().isOk());

    verify(postService).update(anyLong(), postUpdateRequestArgumentCaptor.capture());

    PostUpdateRequest capturedRequest = postUpdateRequestArgumentCaptor.getValue();
    List<MultipartFile> capturedAddedImages = capturedRequest.getAddedImages();
    assertThat(capturedAddedImages.size()).isEqualTo(2);

    List<Long> capturedDeletedImages = capturedRequest.getDeletedImages();
    assertThat(capturedDeletedImages.size()).isEqualTo(2);
    assertThat(capturedDeletedImages).contains(deletedImages.get(0), deletedImages.get(1));
  }

  @Test
  void deleteTest() throws Exception {
    // given
    Long id = 1L;

    // when, then
    mockMvc.perform(
        delete("/api/posts/{id}", id))
    .andExpect(status().isOk());

    verify(postService).delete(id);
  }
}
