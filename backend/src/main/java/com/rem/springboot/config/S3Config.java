package com.rem.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {
  @Value("${s3.credentials.access-key}")
  private String accessKey;

  @Value("${s3.credentials.secret-key}")
  private String secretKey;

  @Bean
  public S3Client defaultS3Client() {
    AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
    return S3Client.builder()
        .region(Region.AP_NORTHEAST_2)
        .forcePathStyle(true)
        .credentialsProvider(StaticCredentialsProvider.create(credentials))
        .build();
  }
}
