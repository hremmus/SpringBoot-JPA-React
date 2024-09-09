package com.rem.springboot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class Location {
  public Location(String global, String local, double latitude, double longitude) {
    this.global = global;
    this.local = local;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String global;

  @Column(nullable = false)
  private String local;

  @Column(nullable = false)
  private double latitude;

  @Column(nullable = false)
  private double longitude;

  public static Location map(String line) {
    String[] split = line.split(",");
    Location location = new Location();
    location.global = split[0];
    location.local = split[1];
    location.latitude = Double.parseDouble(split[2]);
    location.longitude = Double.parseDouble(split[3]);

    return location;
  }
}
