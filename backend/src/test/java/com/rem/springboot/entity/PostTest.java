package com.rem.springboot.entity;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;
import com.rem.springboot.payload.request.PostUpdateRequest;

class PostTest {
  @Test
  void updateTest() {
    // given
    Image a = new Image("a.jpg");
    ReflectionTestUtils.setField(a, "id", 1L);
    Image b = new Image("b.jpg");
    ReflectionTestUtils.setField(b, "id", 2L);

    User user = new User("user@email.com", "123456a!", "nickname", emptyList());

    Category category = new Category("category1", null);

    Post post = new Post("title", "content", user, category, List.of(a, b));

    // when
    MockMultipartFile cFile = new MockMultipartFile("c", "c.png", MediaType.IMAGE_PNG_VALUE, "cFile".getBytes());
    PostUpdateRequest postUpdateRequest = new PostUpdateRequest("title update", "content update", 1L, List.of(cFile), List.of(a.getId()));
    Post.ImageUpdateResult imageUpdateResult = post.update(postUpdateRequest);

    // then
    assertThat(post.getTitle()).isEqualTo(postUpdateRequest.getTitle());
    assertThat(post.getContent()).isEqualTo(postUpdateRequest.getContent());
    assertThat(post.getCategory().getId()).isEqualTo(postUpdateRequest.getCategoryId());

    List<Image> resultImages = post.getImages();
    List<String> resultOriginNames = resultImages.stream().map(i -> i.getOriginName()).collect(toList());
    assertThat(resultImages.size()).isEqualTo(2);
    assertThat(resultOriginNames).contains(b.getOriginName(), cFile.getOriginalFilename());

    List<MultipartFile> addedImageFiles = imageUpdateResult.getAddedImageFiles();
    assertThat(addedImageFiles.size()).isEqualTo(1);
    assertThat(addedImageFiles.get(0).getOriginalFilename()).isEqualTo(cFile.getOriginalFilename());

    List<Image> addedImages = imageUpdateResult.getAddedImages();
    List<String> addedOriginNames = addedImages.stream().map(i -> i.getOriginName()).collect(toList());
    assertThat(addedImages.size()).isEqualTo(1);
    assertThat(addedOriginNames).contains(cFile.getOriginalFilename());

    List<Image> deletedImages = imageUpdateResult.getDeletedImages();
    List<String> deletedOriginNames = deletedImages.stream().map(i -> i.getOriginName()).collect(toList());
    assertThat(deletedImages.size()).isEqualTo(1);
    assertThat(deletedOriginNames).contains(a.getOriginName());
  }
}
