package com.rem.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.rem.springboot.security.AccessDeniedHandlerImpl;
import com.rem.springboot.security.AuthTokenFilter;
import com.rem.springboot.security.AuthenticationEntryPointImpl;
import com.rem.springboot.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
  private final AuthenticationEntryPointImpl authEntryPoint;
  private final AccessDeniedHandlerImpl accessDeniedHandler;
  private final UserDetailsServiceImpl userDetailsService;

  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return webSecurity -> webSecurity.ignoring()
        .requestMatchers("/h2-console/**", "/favicon.ico")
        .requestMatchers("/swagger-ui/**", "/swagger-resources/**", "/v3/api-docs/**");
  }
  
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .exceptionHandling(exceptionHandling -> exceptionHandling
            .authenticationEntryPoint(authEntryPoint)
            .accessDeniedHandler(accessDeniedHandler))
        .sessionManagement(sessionManagement -> sessionManagement
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorizeRequests -> authorizeRequests
                .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                .requestMatchers(HttpMethod.GET, "/image/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/logout").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/user/{id}/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/user/checkpassword").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/user").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/posts/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/{id}").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/posts/{id}").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/comments/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/comments/{id}").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/comments/{id}").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                .anyRequest().hasAnyRole("ADMIN"))
        .addFilterBefore(new AuthTokenFilter(userDetailsService),
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:3000");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}
