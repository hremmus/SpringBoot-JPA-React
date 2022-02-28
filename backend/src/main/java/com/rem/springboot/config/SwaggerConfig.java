package com.rem.springboot.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;

@Import(BeanValidatorPluginsConfiguration.class)
@Configuration
public class SwaggerConfig {
  private static final String API_NAME = "Study";
  private static final String API_DESCRIPTION = "Study REST API Documentation";
  private static final String API_VERSION = "1.0.0";

  @Bean
  public Docket api() {
    return new Docket(DocumentationType.OAS_30)
        .apiInfo(apiInfo())
        .select() // ApiSelectorBuilder
        .apis(RequestHandlerSelectors.basePackage("com.rem.springboot.web"))
        .paths(PathSelectors.any())
        .build()
        .securitySchemes(List.of(apiKey()))
        .securityContexts(List.of(securityContext()));
  }

  private ApiInfo apiInfo() {
    return new ApiInfoBuilder()
        .title(API_NAME)
        .description(API_DESCRIPTION)
        .version(API_VERSION)
        .build();
  }

  private static ApiKey apiKey() {
    return new ApiKey("Authorization", "Bearer Token", "header");
  }

  private SecurityContext securityContext() {
    return SecurityContext.builder().securityReferences(defaultAuth())
        .operationSelector(oc -> oc.requestMappingPattern().startsWith("/api")).build();
  }

  private List<SecurityReference> defaultAuth() {
    AuthorizationScope authorizationScope = new AuthorizationScope("global", "global access"); // 전역적
    return List.of(new SecurityReference("Authorization", new AuthorizationScope[] {authorizationScope}));
  }
}
