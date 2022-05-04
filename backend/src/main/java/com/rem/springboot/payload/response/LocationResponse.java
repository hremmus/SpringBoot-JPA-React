package com.rem.springboot.payload.response;

import java.util.List;
import com.rem.springboot.dto.LocationDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LocationResponse {
  private List<LocationDto> locationList;
}
