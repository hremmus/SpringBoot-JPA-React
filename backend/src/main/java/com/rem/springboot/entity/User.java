package com.rem.springboot.entity;

import static java.util.stream.Collectors.toSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
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
public class User {
  public User(String email, String password, String nickname, List<Role> roles) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.roles = roles.stream().map(r -> new Role(r.getName())).collect(toSet());
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
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
  @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
  @JoinTable(name = "user_role",
  joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
  inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
  private Set<Role> roles = new HashSet<>();
}
