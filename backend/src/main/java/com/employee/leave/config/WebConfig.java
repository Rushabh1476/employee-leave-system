package com.employee.leave.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("prod")
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve only static frontend assets and root index (do NOT capture /api/**)
        registry
            .addResourceHandler("/", "/index.html", "/static/**", "/favicon.ico", "/manifest.json", "/robots.txt")
            .addResourceLocations("file:../frontend/build/", "classpath:/static/")
            .setCachePeriod(0);
    }
}
