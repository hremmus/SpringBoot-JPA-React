package com.rem.springboot.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.rem.springboot.entity.Location;
import com.rem.springboot.exception.LocationNotFoundException;
import com.rem.springboot.payload.request.LocationCreateRequest;
import com.rem.springboot.repository.LocationRepository;
import com.rem.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class LocationServiceImpl {
  private final UserRepository userRepository;
  private final LocationRepository locationRepository;

  @PostConstruct // LocationService bean이 등록된 이후 실행됨 => init
  public void initLocationData() throws IOException {
    if (locationRepository.count() == 0) {
      Resource resource = new ClassPathResource("locations_kr.csv");
      List<String> allLines =
          Files.readAllLines(resource.getFile().toPath(), StandardCharsets.UTF_8);
      List<Location> locations = allLines.stream().map(Location::map).collect(Collectors.toList());

      locationRepository.saveAll(locations);
    }
  }

  @Transactional
  @PreAuthorize("@userGuard.check(#id)")
  public void addLocation(Long id, LocationCreateRequest locationCreateRequest) {
    Location location = locationRepository
        .findByProvinceAndCity(locationCreateRequest.getProvince(), locationCreateRequest.getCity())
        .orElseThrow(LocationNotFoundException::new);

    userRepository.findById(id).ifPresent(u -> u.updateLocation(location));
  }
}
