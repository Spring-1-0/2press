package com.spring.printFlow.config;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.spring.printFlow.components.TokenValidationInterceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    private TokenValidationInterceptor tokenValidationInterceptor;

    @Override
    public void addInterceptors(@SuppressWarnings("null") InterceptorRegistry registry) {
        registry.addInterceptor(tokenValidationInterceptor).addPathPatterns("/api/**")
        .excludePathPatterns("/api/users/login", "/api/user/forget-password", "/api/user/reset-password","/api/files/fetch","/api/convert-to-pdf");
    }
}
