package com.rem.springboot.entity;

import static java.util.stream.Collectors.toSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.annotations.SQLDelete;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@ToString
@SQLDelete(sql = "UPDATE users SET deleted = 1 WHERE user_id = ?")
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

  private String refreshToken;

  private boolean deleted = false;

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  public void updatePassword(String password) {
    this.password = password;
  }

  public void updateNickname(String nickname) {
    this.nickname = nickname;
  }
}
