package com.rem.springboot.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class Location {
  public Location(String province, String city) {
    this.province = province;
    this.city = city;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = true)
  private String province;

  @Column(nullable = false)
  private String city;

  public static Location map(String line) {
    String[] split = line.split(",");
    Location location = new Location();
    if (!split[1].equals("none")) location.province = split[1];
    location.city = split[0];
    return location;
  }
}
