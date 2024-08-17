package com.rem.springboot.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.util.ReflectionTestUtils.setField;
import java.io.IOException;
import java.net.URI;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import io.findify.s3mock.S3Mock;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

class SimpleStorageServiceImplTest {
  private static S3Mock s3Mock;
  private static S3Client s3Client;
  private static int PORT = 8001;
  private static String BUCKET_NAME = "testbucket";

  @InjectMocks
  private static SimpleStorageServiceImpl s3Service;

  @BeforeAll
  static void setUp() {
    s3Mock = new S3Mock.Builder().withPort(PORT).withInMemoryBackend().build();
    s3Mock.start();

    s3Client = S3Client.builder().endpointOverride(URI.create("http://localhost:8001"))
        .forcePathStyle(true)
        .credentialsProvider(
            StaticCredentialsProvider.create(AwsBasicCredentials.create("accessKey", "secretKey")))
        .region(Region.AP_NORTHEAST_2).build();

    s3Service = new SimpleStorageServiceImpl();
    setField(s3Service, "s3", s3Client);
    setField(s3Service, "bucket", BUCKET_NAME);

    s3Client.createBucket(CreateBucketRequest.builder().bucket(BUCKET_NAME).build());
  }

  @AfterAll
  static void tearDown() {
    s3Mock.stop();
  }

  @Test
  void uploadTest() throws IOException {
    // given
    String filename = "image.jpg";
    String content = "content";
    String contentType = "image/jpg";
    MultipartFile multipartFile = new MockMultipartFile(filename, filename, contentType, content.getBytes());

    // when
    String s3path = s3Service.upload(multipartFile, filename);

    // then
    ResponseInputStream<GetObjectResponse> object =
        s3Client.getObject(GetObjectRequest.builder().bucket(BUCKET_NAME).key(filename).build());
    assertEquals(object.response().contentLength(), content.length());
    assertThat(s3path).contains(filename);

    // PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(BUCKET_NAME).key(filename).build();
    // InputStream inputStream = new ByteArrayInputStream(content);
    // PutObjectResponse s3Object = s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, inputStream.available()));
    // assertTrue(s3Object.sdkHttpResponse().isSuccessful());
  }

  @Test
  void deleteTest() throws IOException {
    // given
    String filename = "image.jpg";
    String content = "content";
    String contentType = "image/jpg";
    MultipartFile multipartFile = new MockMultipartFile(filename, filename, contentType, content.getBytes());
    RequestBody requestBody = RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize());
    
    s3Client.putObject(PutObjectRequest.builder().bucket(BUCKET_NAME).key(filename).build(), requestBody);

    // when
    s3Service.delete(filename);

    // then
    assertThrows(S3Exception.class, () -> s3Client.getObject(b -> b.bucket(BUCKET_NAME).key(filename)));
  }
}
