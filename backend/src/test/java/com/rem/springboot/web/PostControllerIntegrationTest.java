package com.rem.springboot.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
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
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.User;
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

  User user1, user2;
  Category category;

  @BeforeEach
  void beforeEach() throws Exception {
    mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    initDB.init();
    user1 = userRepository.findByEmail(initDB.getUser1Email()).orElseThrow(UserNotFoundException::new);
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
}
