package com.rem.springboot.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
import com.rem.springboot.TestInitDB;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.PostNotFoundException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.request.PostCreateRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.repository.CategoryRepository;
import com.rem.springboot.repository.PostRepository;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.service.AuthServiceImpl;
import com.rem.springboot.service.PostServiceImpl;

@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class PostControllerIntegrationTest {
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
  PostRepository postRepository;

  @Autowired
  AuthServiceImpl authService;

  @Autowired
  PostServiceImpl postService;

  User user1, user2, admin;
  Category category;

  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    initDB.init();
    user1 = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
    user2 = userRepository.findByEmail(initDB.getUser2Email()).orElseThrow(UserNotFoundException::new);
    admin = userRepository.findByEmail(initDB.getAdminEmail()).orElseThrow(UserNotFoundException::new);
    category = categoryRepository.findAll().get(0);
  }

  @Test
  void createTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    PostCreateRequest request = new PostCreateRequest("title", "content", user1.getId(), category.getId(), List.of());

    // when, then
    mockMvc.perform(
        multipart("/api/posts")
        .param("title", request.getTitle())
        .param("content", request.getContent())
        .param("categoryId", String.valueOf(request.getCategoryId()))
        .with(requestPostProcessor -> {
          requestPostProcessor.setMethod("POST");
          return requestPostProcessor;
        })
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isCreated());

    Post post = postRepository.findAll().get(0);
    assertThat(post.getTitle()).isEqualTo("title");
    assertThat(post.getContent()).isEqualTo("content");
    assertThat(post.getUser().getId()).isEqualTo(user1.getId());
  }

  @Test
  void readAllTest() throws Exception {
    // given
    PostReadCondition condition = new PostReadCondition(0, 1, List.of(), List.of());

    // when, then
    mockMvc.perform(
        get("/api/posts")
        .param("page", String.valueOf(condition.getPage()))
        .param("size", String.valueOf(condition.getSize()))
        .param("categoryId", String.valueOf(1L), String.valueOf(2L))
        .param("userId", String.valueOf(1L)))
    .andExpect(status().isOk());
  }

  @Test
  void createUnauthorizedByNoneTokenTest() throws Exception {
    // given
    PostCreateRequest request = new PostCreateRequest("title", "content", user1.getId(), category.getId(), List.of());

    // when, then
    mockMvc.perform(
        multipart("/api/posts")
        .param("title", request.getTitle())
        .param("content", request.getContent())
        .param("categoryId", String.valueOf(request.getCategoryId()))
        .with(requestPostProcessor -> {
          requestPostProcessor.setMethod("POST");
          return requestPostProcessor;
        })
        .contentType(MediaType.MULTIPART_FORM_DATA))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void readTest() throws Exception {
    // given
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    // when, then
    mockMvc.perform(
        get("/api/posts/{id}", post.getId()))
    .andExpect(status().isOk());
  }

  @Test
  void updateByResourceOwnerTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    String updatedTitle = "updatedTitle";
    String updatedContent = "updatedContent";

    // when, then
    mockMvc.perform(
        multipart("/api/posts/{id}", post.getId())
        .param("title", updatedTitle)
        .param("content", updatedContent)
        .with(requestPostProcessor -> { requestPostProcessor.setMethod("PUT"); return requestPostProcessor; })
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());

    Post updatedPost = postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new);
    assertThat(updatedPost.getTitle()).isEqualTo(updatedTitle);
    assertThat(updatedPost.getContent()).isEqualTo(updatedContent);
  }

  @Test
  void updateByAdminTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    String updatedTitle = "updatedTitle";
    String updatedContent = "updatedContent";

    // when, then
    mockMvc.perform(
        multipart("/api/posts/{id}", post.getId())
        .param("title", updatedTitle)
        .param("content", updatedContent)
        .with(requestPostProcessor -> { requestPostProcessor.setMethod("PUT"); return requestPostProcessor; })
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());

    Post updatedPost = postRepository.findById(post.getId()).orElseThrow(PostNotFoundException::new);
    assertThat(updatedPost.getTitle()).isEqualTo(updatedTitle);
    assertThat(updatedPost.getContent()).isEqualTo(updatedContent);
  }

  @Test
  void updateUnauthorizedByNoneTokenTest() throws Exception {
    Post post = postRepository.save(new Post("title", "content", user2, category, List.of()));

    String updatedTitle = "updatedTitle";
    String updatedContent = "updatedContent";

    // when, then
    mockMvc.perform(
        multipart("/api/posts/{id}", post.getId())
        .param("title", updatedTitle)
        .param("content", updatedContent)
        .with(requestPostProcessor -> { requestPostProcessor.setMethod("PUT"); return requestPostProcessor; })
        .contentType(MediaType.MULTIPART_FORM_DATA))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void updateAccessDeniedByNotResourceOwnerTest() throws Exception {
    LoginResponse notOwnerLoginResponse = authService.login(new LoginRequest(initDB.getUser2Email(), initDB.getPassword()));
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    String updatedTitle = "updatedTitle";
    String updatedContent = "updatedContent";

    // when, then
    mockMvc.perform(
        multipart("/api/posts/{id}", post.getId())
        .param("title", updatedTitle)
        .param("content", updatedContent)
        .with(requestPostProcessor -> { requestPostProcessor.setMethod("PUT"); return requestPostProcessor; })
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .header("Authorization", notOwnerLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }

  @Test
  void deleteByResourceOwnerTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    // when, then
    mockMvc.perform(
        delete("/api/posts/{id}", post.getId())
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());

    assertThatThrownBy(() -> postService.read(post.getId())).isInstanceOf(PostNotFoundException.class);
  }

  @Test
  void deleteByAdminTest() throws Exception {
    // given
    LoginResponse adminLoginResponse = authService.login(new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    // when, then
    mockMvc.perform(
        delete("/api/posts/{id}", post.getId())
        .header("Authorization", adminLoginResponse.getAccessToken()))
    .andExpect(status().isOk());

    assertThatThrownBy(() -> postService.read(post.getId())).isInstanceOf(PostNotFoundException.class);
  }

  @Test
  void deleteAccessDeniedByNotResourceOwnerTest() throws Exception {
    // given
    LoginResponse notOwnerLoginResponse = authService.login(new LoginRequest(initDB.getUser2Email(), initDB.getPassword()));
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    // when, then
    mockMvc.perform(
        delete("/api/posts/{id}", post.getId())
        .header("Authorization", notOwnerLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }

  @Test
  void deleteUnauthorizedByNoneTokenTest() throws Exception {
    // given
    Post post = postRepository.save(new Post("title", "content", user1, category, List.of()));

    // when, then
    mockMvc.perform(
        delete("/api/posts/{id}", post.getId()))
    .andExpect(status().isUnauthorized());
  }
}
