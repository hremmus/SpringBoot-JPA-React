package com.rem.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.rem.springboot.security.AccessDeniedHandlerImpl;
import com.rem.springboot.security.AuthTokenFilter;
import com.rem.springboot.security.AuthenticationEntryPointImpl;
import com.rem.springboot.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;

@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  private final UserDetailsServiceImpl userDetailsService;

  @Override
  public void configure(WebSecurity webSecurity) {
    webSecurity
    .ignoring().antMatchers("/h2-console/**", "/favicon.ico");
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
    .cors().and().csrf().disable()
    .exceptionHandling()
    .authenticationEntryPoint(new AuthenticationEntryPointImpl())
    .accessDeniedHandler(new AccessDeniedHandlerImpl()).and()
    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
    .authorizeRequests()
    .antMatchers(HttpMethod.GET, "/image/**").permitAll()
    .antMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
    .antMatchers(HttpMethod.DELETE, "/api/user/{id}/**").authenticated()
    .antMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
    .antMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
    .antMatchers(HttpMethod.POST, "/api/posts").authenticated()
    .antMatchers(HttpMethod.GET, "/api/**").permitAll()
    .anyRequest().hasAnyRole("ADMIN").and()
    .addFilterBefore(new AuthTokenFilter(userDetailsService), UsernamePasswordAuthenticationFilter.class);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}
