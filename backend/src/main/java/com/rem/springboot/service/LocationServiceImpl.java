package com.rem.springboot.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.rem.springboot.dto.LocationDto;
import com.rem.springboot.entity.Location;
import com.rem.springboot.payload.response.LocationResponse;
import com.rem.springboot.repository.LocationRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class LocationServiceImpl {
  private final LocationRepository locationRepository;

  @PostConstruct // LocationService bean이 등록된 이후 실행됨 => init
  public void initLocationData() throws IOException {
    if (locationRepository.count() == 0) {
      Resource resource = new ClassPathResource("locations_kr.csv");
      InputStreamReader inputStreamReader =
          new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);

      List<String> allLines =
          new BufferedReader(inputStreamReader).lines().collect(Collectors.toList());
      List<Location> locationList =
          allLines.stream().map(Location::map).collect(Collectors.toList());

      locationRepository.saveAll(locationList);
    }
  }

  public LocationResponse loadLocations(String global) throws JsonProcessingException {
    List<Location> locationList;
    List<LocationDto> locationDtoList = new ArrayList<LocationDto>();

    if (global != null && !global.isEmpty()) {
      locationList = locationRepository.findByGlobal(global);
    } else {
      locationList = locationRepository.findAll();
    }

    for (int i = 0; i < locationList.size(); i++) {
      locationDtoList.add(LocationDto.toDto(locationList.get(i)));
    }

    return new LocationResponse(locationDtoList);
  }
}
