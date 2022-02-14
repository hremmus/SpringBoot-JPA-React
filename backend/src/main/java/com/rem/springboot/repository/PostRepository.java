package com.rem.springboot.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.rem.springboot.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long>, CustomPostRepository {
  @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.id = :id")
  Optional<Post> findByIdWithUser(@Param("id") Long id);
}
