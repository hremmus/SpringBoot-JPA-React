package com.rem.springboot.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.rem.springboot.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Boolean existsByEmail(String email);

  Boolean existsByNickname(String nickname);

  @Query("SELECT u FROM User u WHERE (u.email LIKE CONCAT('%', :email, '%') OR u.nickname LIKE CONCAT('%', :nickname, '%')) AND u.deleted = FALSE")
  List<User> findAllByCondition(@Param("email") String email, @Param("nickname") String nickname);
}
