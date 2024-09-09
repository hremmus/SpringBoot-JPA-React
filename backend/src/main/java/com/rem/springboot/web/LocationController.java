package com.rem.springboot.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.response.LocationResponse;
import com.rem.springboot.service.LocationServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Api(value = "Location Controller", tags = "Location")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LocationController {
  private final LocationServiceImpl locationService;

  @ApiOperation(value = "지역 리스트 load")
  @GetMapping("/location")
  @ResponseStatus(HttpStatus.OK)
  public Response loadLocations(@Valid String global) throws JsonProcessingException {
    LocationResponse response = locationService.loadLocations(global);
    return Response.success(response);
  }
}
