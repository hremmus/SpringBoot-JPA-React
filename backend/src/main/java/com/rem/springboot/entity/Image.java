package com.rem.springboot.entity;

import java.util.Arrays;
import java.util.UUID;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.rem.springboot.exception.UnsupportedFileFormatException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Image {
  public Image(String originName) {
    this.originName = originName;
    uniqueName = String.valueOf(UUID.randomUUID()) + "." + getExtension(originName);
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String originName;

  @Column(nullable = false)
  private String uniqueName;

  private final static String supportedExtension[] = {"png", "jpg", "jpeg", "gif", "bmp"};

  private String getExtension(String originName) {
    String extension = originName.substring(originName.lastIndexOf(".") + 1);
    if (isSupportedFormat(extension)) return extension;
    throw new UnsupportedFileFormatException();
  }

  private boolean isSupportedFormat(String extension) {
    return Arrays.stream(supportedExtension).anyMatch(e -> e.equalsIgnoreCase(extension));
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Post post;

  public void initPost(Post post) {
    if (this.post == null) {
      this.post = post;
    }
  }
}
