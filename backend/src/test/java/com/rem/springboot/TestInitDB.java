package com.rem.springboot;

import java.util.List;
import javax.management.relation.RoleNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.Category;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
import com.rem.springboot.repository.CategoryRepository;
import com.rem.springboot.repository.RoleRepository;
import com.rem.springboot.repository.UserRepository;

@Component
public class TestInitDB {
  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  CategoryRepository categoryRepository;

  private String user1Email = "user1@eamil.com";
  private String user2Email = "user2@email.com";
  private String adminEmail = "admin@email.com";
  private String password = "123456a!";

  @Transactional
  public void init() throws Exception {
    initRole();
    initTestUser();
    initCategory();
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
    Category category1 = new Category("category1", null);
    Category category2 = new Category("category2", category1);
    categoryRepository.saveAll(List.of(category1, category2));
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
