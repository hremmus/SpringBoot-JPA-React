package com.rem.springboot.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rem.springboot.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
  List<Location> findByGlobal(String global);
}
