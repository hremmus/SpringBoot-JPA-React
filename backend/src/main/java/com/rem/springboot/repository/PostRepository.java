package com.rem.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rem.springboot.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

}
