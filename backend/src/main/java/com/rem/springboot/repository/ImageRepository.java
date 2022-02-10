package com.rem.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rem.springboot.entity.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {

}
