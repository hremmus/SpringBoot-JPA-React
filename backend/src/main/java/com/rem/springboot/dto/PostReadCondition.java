package com.rem.springboot.dto;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostReadCondition {
  @NotNull
  @PositiveOrZero
  private Integer page;

  @NotNull
  @Positive
  private Integer size;

  private List<Long> categoryId = new ArrayList<>();
  private List<Long> userId = new ArrayList<>();
}
