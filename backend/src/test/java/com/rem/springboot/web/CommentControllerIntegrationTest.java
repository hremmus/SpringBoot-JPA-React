package com.rem.springboot.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
import com.rem.springboot.entity.Comment;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.CommentNotFoundException;
import com.rem.springboot.exception.UserNotFoundException;
import com.rem.springboot.payload.request.CommentCreateRequest;
import com.rem.springboot.payload.request.CommentUpdateRequest;
import com.rem.springboot.payload.request.LoginRequest;
import com.rem.springboot.payload.response.LoginResponse;
import com.rem.springboot.repository.CategoryRepository;
import com.rem.springboot.repository.CommentRepository;
import com.rem.springboot.repository.PostRepository;
import com.rem.springboot.repository.UserRepository;
import com.rem.springboot.service.AuthServiceImpl;
import com.rem.springboot.service.CommentServiceImpl;

@Transactional
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class CommentControllerIntegrationTest {
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
  CommentRepository commentRepository;

  @Autowired
  AuthServiceImpl authService;

  @Autowired
  CommentServiceImpl commentService;

  ObjectMapper objectMapper = new ObjectMapper();

  User user1, user2, admin;
  Category category;
  Post post;

  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    initDB.init();

    user1 = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
    user2 = userRepository.findByEmail(initDB.getUser2Email()).orElseThrow(UserNotFoundException::new);
    admin = userRepository.findByEmail(initDB.getAdminEmail()).orElseThrow(UserNotFoundException::new);
    category = categoryRepository.findAll().get(0);
    post = postRepository.save(new Post("title", "content", user1, category, List.of()));
  }

  @Test
  void createTest() throws Exception {
    // given
    CommentCreateRequest request = new CommentCreateRequest("content", post.getId(), null, null);
    LoginResponse loginResponse = authService.login(new LoginRequest(user1.getEmail(), initDB.getPassword()));

    // when, then
    mockMvc.perform(
        post("/api/comments")
        .header("Authorization", loginResponse.getAccessToken())
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isCreated());

    Comment comment = commentRepository.findAll().get(0);
    assertThat(comment.getContent()).isEqualTo("content");
    assertThat(comment.getPost().getId()).isEqualTo(post.getId());
  }

  @Test
  void createUnauthorizedByNoneTokenTest() throws Exception {
    // given
    CommentCreateRequest request = new CommentCreateRequest("content", post.getId(), user1.getId(), null);

    // when, then
    mockMvc.perform(
        post("/api/comments")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void readAllTest() throws Exception {
    // given, when, then
    mockMvc.perform(
        get("/api/comments")
        .param("postId", String.valueOf(1)))
    .andExpect(status().isOk());
  }

  @Test
  void updateByResourceOwnerTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    CommentUpdateRequest request = new CommentUpdateRequest("updated content");

    // when, then
    mockMvc.perform(
        patch("/api/comments/{id}", comment.getId())
        .param("content", request.getContent())
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());

    Comment updatedComment = commentRepository.findById(comment.getId()).orElseThrow(CommentNotFoundException::new);
    assertThat(updatedComment.getContent()).isEqualTo(comment.getContent());
  }

  @Test
  void updateUnauthorizedByNoneTokenTest() throws Exception {
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    CommentUpdateRequest request = new CommentUpdateRequest("updated content");

    // when, then
    mockMvc.perform(
        patch("/api/comments/{id}", comment.getId())
        .param("content", request.getContent()))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void updateAccessDeniedByNotResourceOwnerTest() throws Exception {
    LoginResponse notOwnerLoginResponse = authService.login(new LoginRequest(initDB.getUser2Email(), initDB.getPassword()));
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    CommentUpdateRequest request = new CommentUpdateRequest("updated content");

    // when, then
    mockMvc.perform(
        patch("/api/comments/{id}", comment.getId())
        .param("content", request.getContent())
        .header("Authorization", notOwnerLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }

  @Test
  void updateAccessDeniedByAdminTest() throws Exception {
    // given
    LoginResponse adminLoginResponse = authService.login(new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    CommentUpdateRequest request = new CommentUpdateRequest("updated content");

    // when, then
    mockMvc.perform(
        patch("/api/comments/{id}", comment.getId())
        .param("content", request.getContent())
        .header("Authorization", adminLoginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }

  @Test
  void deleteByResourceOwnerTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    // when, then
    mockMvc.perform(
        delete("/api/comments/{id}", comment.getId())
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isOk());

    assertThat(commentRepository.findById(comment.getId())).isEmpty();
  }

  @Test
  void deleteByAdminTest() throws Exception {
    // given
    LoginResponse adminLoginResponse = authService.login(new LoginRequest(initDB.getAdminEmail(), initDB.getPassword()));
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    // when, then
    mockMvc.perform(
        delete("/api/comments/{id}", comment.getId())
        .header("Authorization", adminLoginResponse.getAccessToken()))
    .andExpect(status().isOk());

    assertThat(commentRepository.findById(comment.getId())).isEmpty();
  }

  @Test
  void deleteUnauthorizedByNoneTokenTest() throws Exception {
    // given
    Comment comment = commentRepository.save(new Comment("content", user1, post, null));

    // when, then
    mockMvc.perform(
        delete("/api/comments/{id}", comment.getId()))
    .andExpect(status().isUnauthorized());
  }

  @Test
  void deleteAccessDeniedByNotResourceOwnerTest() throws Exception {
    // given
    LoginResponse loginResponse = authService.login(new LoginRequest(initDB.getUser1Email(), initDB.getPassword()));
    Comment comment = commentRepository.save(new Comment("content", user2, post, null));

    // when, then
    mockMvc.perform(
        delete("/api/comments/{id}", comment.getId())
        .header("Authorization", loginResponse.getAccessToken()))
    .andExpect(status().isForbidden());
  }
}
