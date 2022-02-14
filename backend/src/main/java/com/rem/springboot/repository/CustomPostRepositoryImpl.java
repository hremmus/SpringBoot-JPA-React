package com.rem.springboot.repository;

import static com.querydsl.core.types.Projections.constructor;
import static com.rem.springboot.entity.QPost.post;
import java.util.List;
import java.util.function.Function;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.rem.springboot.dto.PostReadCondition;
import com.rem.springboot.dto.PostSimpleDto;
import com.rem.springboot.entity.Post;

@Transactional(readOnly = true)
public class CustomPostRepositoryImpl extends QuerydslRepositorySupport implements CustomPostRepository {
  public CustomPostRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
    super(Post.class);
    jpaQueryfactory = jpaQueryFactory;
  }

  private final JPAQueryFactory jpaQueryfactory;

  @Override
  public Page<PostSimpleDto> findAllByCondition(PostReadCondition condition) {
    Pageable pageable = PageRequest.of(condition.getPage(), condition.getSize());
    Predicate predicate = createPredicate(condition);
    return new PageImpl<>(fetchAll(predicate, pageable), pageable, fetchCount(predicate));
  }

  private Predicate createPredicate(PostReadCondition condition) {
    return new BooleanBuilder()
        .and(orConditionsByEqCategoryIds(condition.getCategoryId()))
        .and(orConditionsByEqUserIds(condition.getUserId()));
  }

  private List<PostSimpleDto> fetchAll(Predicate predicate, Pageable pageable) {
    return getQuerydsl().applyPagination(
        pageable,
        jpaQueryfactory
        .select(constructor(PostSimpleDto.class, post.id, post.title, post.user.nickname, post.createdDate))
        .from(post)
        .join(post.user)
        .where(predicate)
        .orderBy(post.id.desc()))
        .fetch();
  }

  private Long fetchCount(Predicate predicate) {
    return jpaQueryfactory
        .select(post.count())
        .from(post)
        .where(predicate)
        .fetchOne();
  }

  private Predicate orConditionsByEqCategoryIds(List<Long> categoryIds) {
    return orConditions(categoryIds, post.category.id::eq);
  }

  private Predicate orConditionsByEqUserIds(List<Long> userIds) {
    return orConditions(userIds, post.user.id::eq);
  }

  private <T> Predicate orConditions(List<T> values, Function<T, BooleanExpression> term) {
    return values.stream()
        .map(term)
        .reduce(BooleanExpression::or)
        .orElse(null);
  }
}
