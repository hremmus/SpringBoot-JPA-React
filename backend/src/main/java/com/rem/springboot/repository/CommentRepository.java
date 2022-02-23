package com.rem.springboot.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.rem.springboot.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.parent WHERE c.id = :id")
  Optional<Comment> findByIdWithParent(@Param("id") Long id);

  @Query("SELECT c FROM Comment c JOIN FETCH c.user LEFT JOIN FETCH c.parent WHERE c.post.id = :postId ORDER BY c.parent.id ASC NULLS FIRST, c.id ASC")
  List<Comment> findAllWithUserAndParentByPostIdOrderByParentIdAscNullsFirstCommentIdAsc(@Param("postId") Long postId);
}
