package com.rem.springboot.repository;

import org.springframework.data.domain.Page;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.dto.PostSimpleDto;

public interface CustomPostRepository {
  Page<PostSimpleDto> findAllByCondition(PostReadCondition condition);
}
