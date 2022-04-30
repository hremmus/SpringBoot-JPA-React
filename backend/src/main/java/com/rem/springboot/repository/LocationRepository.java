package com.rem.springboot.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rem.springboot.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
  Optional<Location> findByProvinceAndCity(String province, String city);
}
