package com.rem.springboot.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@RestController
public class IndexController {
  @GetMapping("/")
  public String index() {
    return "Grettings from Spring Boot!";
  }
}
