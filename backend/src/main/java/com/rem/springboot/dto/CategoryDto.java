package com.rem.springboot.dto;

import java.util.ArrayList;
import java.util.List;
import com.rem.springboot.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryDto {
  private Long id;
  private String name;
  private List<CategoryDto> children;

  public static List<CategoryDto> toDtoList(List<Category> categories) {
    HierarchicalStructureConverter converter = HierarchicalStructureConverter.newInstance(
        categories,
        c -> new CategoryDto(c.getId(), c.getName(), new ArrayList<>()),
        c -> c.getParent(),
        c -> c.getId(),
        d -> d.getChildren());
    return converter.convert();
  }
}
