package com.rem.springboot.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import com.rem.springboot.exception.CannotConvertHierarchicalStructureException;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class HierarchicalStructureConverter<K, E, D> {
  private List<E> entities;
  private Function<E, D> toDto;
  private Function<E, E> getParent;
  private Function<E, K> getKey;
  private Function<D, List<D>> getChildren;

  public static <K, E, D> HierarchicalStructureConverter newInstance(List<E> entities,
      Function<E, D> toDto, Function<E, E> getParent, Function<E, K> getKey,
      Function<D, List<D>> getChildren) {
    return new HierarchicalStructureConverter<K, E, D> (entities, toDto, getParent, getKey,
        getChildren);
  }

  public List<D> convert() {
    try {
      return convertInternal();
    } catch (NullPointerException e) {
      throw new CannotConvertHierarchicalStructureException(e.getMessage());
    }
  }

  private List<D> convertInternal() {
    Map<K, D> map = new HashMap<>();
    List<D> roots = new ArrayList<>();

    for (E e : entities) {
      D dto = toDto(e);
      map.put(getKey(e), dto);
      if (hasParent(e)) {
        E parent = getParent(e);
        K parentKey = getKey(parent);
        D parentDto = map.get(parentKey);
        getChildren(parentDto).add(dto);
      } else {
        roots.add(dto);
      }
    }
    return roots;
  }

  private D toDto(E e) {
    return toDto.apply(e);
  }

  private boolean hasParent(E e) {
    return getParent(e) != null;
  }

  private E getParent(E e) {
    return getParent.apply(e);
  }

  private K getKey(E e) {
    return getKey.apply(e);
  }

  private List<D> getChildren(D d) {
    return getChildren.apply(d);
  }
}
