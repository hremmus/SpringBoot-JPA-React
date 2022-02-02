package com.rem.springboot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
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

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthenticationEntryPointImpl unauthorizedHandler;

  @Autowired
  private AccessDeniedHandlerImpl accessDeniedHandler;

  @Override
  public void configure(WebSecurity web) {
    web
    .ignoring().antMatchers("/h2-console/**", "/favicon.ico");
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
    .cors().and().csrf().disable()
    .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).accessDeniedHandler(accessDeniedHandler).and()
    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
    .authorizeRequests().antMatchers("/api/auth/**", "/api/test/**").permitAll()
    .anyRequest().authenticated();

    http.addFilterBefore(new AuthTokenFilter(userDetailsService), UsernamePasswordAuthenticationFilter.class);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}
