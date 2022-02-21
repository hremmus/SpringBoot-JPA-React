package com.rem.springboot;

import java.util.List;
import java.util.stream.IntStream;
import javax.management.relation.RoleNotFoundException;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.Comment;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Post;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
import com.rem.springboot.repository.CategoryRepository;
import com.rem.springboot.repository.CommentRepository;
import com.rem.springboot.repository.PostRepository;
import com.rem.springboot.repository.RoleRepository;
import com.rem.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("local")
public class InitDB {
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;
  private final UserRepository userRepository;
  private final CategoryRepository categoryRepository;
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;

  private String user1Email = "user1@email.com";
  private String user2Email = "user2@email.com";
  private String adminEmail = "admin@email.com";
  private String password = "123456a!";

  @EventListener(ApplicationReadyEvent.class)
  @Transactional
  public void init() throws Exception {
    log.info("initialize database");

    initRole();
    initTestUser();
    initCategory();
    initPost();
    initComment();

    log.info("initialize database");
  }

  private void initRole() {
    roleRepository.saveAll(List.of(new Role(ERole.ROLE_USER), new Role(ERole.ROLE_ADMIN)));
  }

  private void initTestUser() throws RoleNotFoundException {
    userRepository.saveAll(List.of(
        new User(user1Email, passwordEncoder.encode(password), "nickname1", List.of(
            roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new))),
        new User(user2Email, passwordEncoder.encode(password), "nickname2", List.of(
            roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new))),
        new User(adminEmail, passwordEncoder.encode(password), "admin", List.of(
            roleRepository.findByName(ERole.ROLE_USER).orElseThrow(RoleNotFoundException::new),
            roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(RoleNotFoundException::new)))));
  }

  private void initCategory() {
    Category c1 = categoryRepository.save(new Category("category1", null));
    Category c2 = categoryRepository.save(new Category("category2", c1));
    Category c3 = categoryRepository.save(new Category("category3", c1));
    Category c4 = categoryRepository.save(new Category("category4", c2));
    Category c5 = categoryRepository.save(new Category("category5", c2));
    Category c6 = categoryRepository.save(new Category("category6", c4));
    Category c7 = categoryRepository.save(new Category("category7", c3));
    Category c8 = categoryRepository.save(new Category("category8", null));
  }

  private void initPost() {
    User user = userRepository.findAll().get(0);
    Category category = categoryRepository.findAll().get(0);
    IntStream.range(0, 100)
    .forEach(i -> postRepository.save(
        new Post("title" + i, "content" + i, user, category, List.of())));
  }

  private void initComment() {
    User user = userRepository.findAll().get(0);
    Post post = postRepository.findAll().get(0);
    Comment comment1 = commentRepository.save(new Comment("content", user, post, null));
    Comment comment2 = commentRepository.save(new Comment("content", user, post, comment1));
    Comment comment3 = commentRepository.save(new Comment("content", user, post, comment1));
    Comment comment4 = commentRepository.save(new Comment("content", user, post, comment2));
    Comment comment5 = commentRepository.save(new Comment("content", user, post, comment2));
    Comment comment6 = commentRepository.save(new Comment("content", user, post, comment4));
    Comment comment7 = commentRepository.save(new Comment("content", user, post, comment3));
    Comment comment8 = commentRepository.save(new Comment("content", user, post, null));
  }

  public String getUser1Email() {
    return user1Email;
  }

  public String getUser2Email() {
    return user2Email;
  }

  public String getAdminEmail() {
    return adminEmail;
  }

  public String getPassword() {
    return password;
  }
}
