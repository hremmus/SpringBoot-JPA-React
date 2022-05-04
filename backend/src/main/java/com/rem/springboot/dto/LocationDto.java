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
  private String global;
  private String local;
  private double latitude;
  private double longitude;

  public static LocationDto toDto(Location location) {
    return new LocationDto(location.getId(), location.getGlobal(), location.getLocal(),
        location.getLatitude(), location.getLongitude());
  }
}
