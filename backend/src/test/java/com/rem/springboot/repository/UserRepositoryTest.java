package com.rem.springboot.repository;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.ERole;
import com.rem.springboot.entity.Role;
import com.rem.springboot.entity.User;
import com.rem.springboot.exception.UserNotFoundException;


@Transactional
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
class UserRepositoryTest {
  @PersistenceContext
  EntityManager em;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Test
  void createTest() {
    // given
    User user = new User("user1@gmail.com", "123456", "nickname1", createRole(ERole.ROLE_USER));

    // when
    User userEntity = userRepository.save(user);

    // then
    Assertions.assertEquals(user.getId(), userEntity.getId());
  }

  @Test
  void findByEmailTest() {
    // given
    User user = new User("user2@gmail.com", "123456", "nickname2", createRole(ERole.ROLE_USER));
    User userEntity = userRepository.save(user);

    // when
    User findUser = userRepository.findByEmail(userEntity.getEmail()).orElseThrow(UserNotFoundException::new);

    // then
    Assertions.assertEquals(findUser.getEmail(), userEntity.getEmail());
  }

  @Test
  void uniqueEmailTest() {
    // given
    User user = userRepository.save(
        new User("user3@gmail.com", "123456", "nickname3", createRole(ERole.ROLE_USER)));
    User newUser = new User(user.getEmail(), "123456", "nickname4", Collections.emptyList());

    // when, then
    assertThatThrownBy(() -> userRepository.save(newUser))
    .isInstanceOf(DataIntegrityViolationException.class);
  }

  @Test
  void uniqueNicknameTest() {
    // given
    User user = userRepository.save(
        new User("user5@gmail.com", "123456", "nickname5", createRole(ERole.ROLE_USER)));
    User newUser = new User("user6@gmail.com", "123456", user.getNickname(),
        user.getRoles().stream().collect(toList()));

    // when, then
    assertThatThrownBy(() -> userRepository.save(newUser))
    .isInstanceOf(DataIntegrityViolationException.class);
  }

  @Test
  void existsByEmailTest() {
    // given
    User user = userRepository.save(
        new User("user6@gmail.com", "123456", "nickname6", createRole(ERole.ROLE_USER)));

    // when, then
    assertThat(userRepository.existsByEmail(user.getEmail())).isTrue();
    assertThat(userRepository.existsByEmail(user.getEmail() + "test")).isFalse();
  }

  @Test
  void userRoleCascadePersistTest() {
    // given
    List<ERole> eRoles = List.of(ERole.ROLE_USER, ERole.ROLE_ADMIN);
    List<Role> roles = eRoles.stream().map(r -> new Role(r)).collect(toList());
    roleRepository.saveAll(roles);

    User user = userRepository.save(
        new User("user7@gmail.com", "123456", "nickname7",
            List.of(roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(UserNotFoundException::new))));

    // when
    User foundUser = userRepository.findByEmail(user.getEmail()).orElseThrow(UserNotFoundException::new);
    Set<Role> memberRoles = foundUser.getRoles();

    // then
    assertThat(memberRoles.size()).isLessThan(roles.size());
  }

  @Test
  void userRoleCascadeDeleteTest() {
    // given
    List<ERole> eRoles = List.of(ERole.ROLE_USER, ERole.ROLE_ADMIN);
    List<Role> roles = eRoles.stream().map(r -> new Role(r)).collect(toList());
    roleRepository.saveAll(roles);

    User user = userRepository.save(
        new User("user8@gmail.com", "123456", "nickname8", List.of(roles.get(0))));

    // when
    userRepository.deleteById(user.getId());

    // then
    List<Integer> result = em.createNativeQuery(
        "SELECT user_id FROM user_role JOIN user ON user_role.user_id = user.id").getResultList();
    assertThat(result.size()).isZero();
  }

  List<Role> createRole(ERole name) {
    List<ERole> eRoles = List.of(ERole.ROLE_USER, ERole.ROLE_ADMIN);
    List<Role> roles = eRoles.stream().map(r -> new Role(r)).collect(toList());
    roleRepository.saveAll(roles);

    return List.of(roleRepository.findByName(name).orElseThrow(UserNotFoundException::new));
  }
}
