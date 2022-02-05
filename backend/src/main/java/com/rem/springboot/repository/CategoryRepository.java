package com.rem.springboot.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.rem.springboot.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
  @Query("SELECT c FROM Category c LEFT JOIN c.parent p ORDER BY p.id ASC NULLS FIRST, c.id ASC")
  List<Category> findAllOrderByParentIdAscNullsFirstCategoryIdAsc();
}
