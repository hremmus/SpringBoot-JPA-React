package com.rem.springboot.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Comment extends EntityDate {
  public Comment(String content, User user, Post post, Comment parent) {
    this.content = content;
    this.user = user;
    this.post = post;
    this.parent = parent;
    deleted = false;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  @Lob
  private String content;

  @Column(nullable = false)
  private boolean deleted;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Comment parent;

  @OneToMany(mappedBy = "parent")
  private List<Comment> children = new ArrayList<>();

  public void update(String content) {
    this.content = content;
  }

  public void delete() {
    deleted = true;
  }

  public Optional<Comment> findDeletableComment() {
    return hasChildren() ? Optional.empty() : Optional.of(findDeletableCommentByParent());
  }

  private boolean hasChildren() {
    return getChildren().size() != 0;
  }

  private Comment findDeletableCommentByParent() {
    return isDeletableParent() ? getParent().findDeletableCommentByParent() : this;
  }

  private boolean isDeletableParent() {
    return getParent() != null && getParent().isDeleted() && getParent().getChildren().size() == 1;
  }
}
