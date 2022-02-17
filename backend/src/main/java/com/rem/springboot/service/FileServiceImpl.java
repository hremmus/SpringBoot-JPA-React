package com.rem.springboot.service;

import java.io.File;
import java.io.IOException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.rem.springboot.exception.FileUploadFailureException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileServiceImpl implements InitializingBean, FileService {
  @Value("${upload.image.location}")
  private String location;

  @Override
  public void afterPropertiesSet() throws Exception {
    File dir = new File(location);
    if (!dir.exists())
      dir.mkdir();
  }

  @Override
  public void upload(MultipartFile file, String filename) {
    try {
      file.transferTo(new File(location + filename));
    } catch(IOException e) {
      throw new FileUploadFailureException(e);
    }
  }

  @Override
  public void delete(String filename) {
    new File(location + filename).delete();
  }
}