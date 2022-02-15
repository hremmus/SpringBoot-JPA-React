package com.rem.springboot.entity;

import static java.util.stream.Collectors.toList;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import org.springframework.web.multipart.MultipartFile;
import com.rem.springboot.payload.request.PostUpdateRequest;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Post extends EntityDate {
  public Post(String title, String content, User user, Category category, List<Image> images) {
    this.title = title;
    this.content = content;
    this.user = user;
    this.category = category;
    this.images = new ArrayList<>();
    addImages(images);
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String content;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  @OneToMany(mappedBy = "post", cascade = CascadeType.PERSIST, orphanRemoval = true)
  private List<Image> images;

  private void addImages(List<Image> added) {
    added.stream().forEach(i -> {
      images.add(i);
      i.initPost(this);
    });
  }

  private void deleteImages(List<Image> deleted) {
    deleted.stream().forEach(di -> images.remove(di));
  }

  @Getter
  @AllArgsConstructor
  public static class ImageUpdateResult {
    private List<MultipartFile> addedImageFiles;
    private List<Image> addedImages;
    private List<Image> deletedImages;
  }

  public ImageUpdateResult update(PostUpdateRequest request) {
    title = request.getTitle();
    content = request.getContent();
    List<Image> addedImages = convertImageFilesToImages(request.getAddedImages());
    List<Image> deletedImages = convertImageIdsToImages(request.getDeletedImages());
    addImages(addedImages);
    deleteImages(deletedImages);
    return new ImageUpdateResult(request.getAddedImages(), addedImages, deletedImages);
  }

  private List<Image> convertImageFilesToImages(List<MultipartFile> imageFiles) {
    return imageFiles.stream().map(imageFile -> new Image(imageFile.getOriginalFilename())).collect(toList());
  }

  private List<Image> convertImageIdsToImages(List<Long> ids) {
    return ids.stream()
        .map(id -> convertImageIdToImage(id))
        .filter(i -> i.isPresent())
        .map(i -> i.get())
        .collect(toList());
  }

  private Optional<Image> convertImageIdToImage(Long id) {
    return images.stream().filter(i -> i.getId().equals(id)).findAny();
  }
}
