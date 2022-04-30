package com.rem.springboot.web;

import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.rem.springboot.dto.Response;
import com.rem.springboot.payload.request.LocationCreateRequest;
import com.rem.springboot.service.LocationServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(value = "Settings Controller", tags = "Settings")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SettingsController {
  private final LocationServiceImpl locationService;

  @ApiOperation(value = "내 지역 추가")
  @PostMapping("/settings/{id}/location")
  @ResponseStatus(HttpStatus.OK)
  public Response createLocation(@ApiParam(value = "회원 ID", required = true) @PathVariable Long id,
      @Valid @ModelAttribute LocationCreateRequest request) {
    locationService.addLocation(id, request);
    return Response.success();
  }
}
