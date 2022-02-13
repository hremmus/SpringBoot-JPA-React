package com.rem.springboot.entity;

import static java.util.stream.Collectors.toSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
public class User extends EntityDate {
  public User(String email, String password, String nickname, List<Role> roles) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.roles = roles.stream().map(r -> new UserRole(this, r)).collect(toSet());
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  @Column(unique = true)
  @Email
  @NotBlank
  @Size(max = 40)
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;

  @Column(unique = true)
  @NotBlank
  @Size(min = 2, max = 10)
  private String nickname;

  @Setter
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<UserRole> roles = new HashSet<>();
}
