package com.rem.springboot;

import java.util.List;
import javax.management.relation.RoleNotFoundException;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
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
