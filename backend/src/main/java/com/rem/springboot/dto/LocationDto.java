package com.rem.springboot.dto;

import com.rem.springboot.entity.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LocationDto {
  private Long id;
  private String province;
  private String city;

  public static LocationDto toDto(Location location) {
    return new LocationDto(location.getId(), location.getProvince(), location.getCity());
  }
}
