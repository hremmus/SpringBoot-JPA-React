package com.rem.springboot.service;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.rem.springboot.exception.FileUploadFailureException;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@Slf4j
public class SimpleStorageServiceImpl {
  @Autowired
  private S3Client s3;

  @Value("${s3.bucket}")
  private String bucket;

  public String upload(MultipartFile file, String filename) {
    PutObjectRequest request = PutObjectRequest.builder()
        .bucket(bucket)
        .key(filename)
        .acl(ObjectCannedACL.PUBLIC_READ).build();
    
    try {
      s3.putObject(request, RequestBody.fromBytes(file.getBytes()));
      return s3.utilities().getUrl(builder -> builder.bucket(bucket).key(filename)).toString();
    } catch (IOException e) {
      throw new FileUploadFailureException(e);
    }
  }

  public void delete(String s3Path) {
    DeleteObjectRequest request = DeleteObjectRequest.builder().bucket(bucket).key(s3Path).build();
    s3.deleteObject(request);
  }
}
