package com.rem.springboot.service;

import static org.assertj.core.api.Assertions.assertThat;
import java.io.File;
import java.io.IOException;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

class FileServiceImplTest {
  FileServiceImpl fileService = new FileServiceImpl();
  String testLocation = new File("src/test/resources/static").getAbsolutePath() + "/";

  @BeforeEach
  void beforeEach() throws IOException {
    ReflectionTestUtils.setField(fileService, "location", testLocation);
    FileUtils.cleanDirectory(new File(testLocation));
  }

  @Test
  void uploadTest() {
    // given
    MultipartFile file = new MockMultipartFile(
        "testFile", "testFile.txt", MediaType.TEXT_PLAIN_VALUE, "content".getBytes());
    String filename = "testFile.txt";

    // when
    fileService.upload(file, filename);

    // then
    assertThat(isExists(testLocation + filename)).isTrue();
  }

  boolean isExists(String filePath) {
    return new File(filePath).exists();
  }
}
