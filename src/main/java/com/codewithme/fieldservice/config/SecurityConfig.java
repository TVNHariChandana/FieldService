package com.codewithme.fieldservice.config;

import com.codewithme.fieldservice.security.JWTUtil;
import com.codewithme.fieldservice.security.JwtAuthenticationFilter;
import com.codewithme.fieldservice.security.TokenBlockService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import java.util.List;
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JWTUtil jwtUtil,
            UserDetailsService userDetailsService,
            TokenBlockService tokenBlockService) throws Exception {

        JwtAuthenticationFilter jwtAuthenticationFilter =
                new JwtAuthenticationFilter(
                        jwtUtil,
                        userDetailsService,
                        tokenBlockService
                );
                http
    .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                        .exceptionHandling(exception -> exception
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Access Denied\"}");
                    response.getWriter().flush();
                })

                        )
                        .authorizeHttpRequests(auth -> auth

                                // Allow CORS preflight requests
                                        .requestMatchers(
                                                HttpMethod.OPTIONS,
                                                "/**"
                                        ).permitAll()

                                // Public APIs
                                .requestMatchers(
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/api/user_auth/register",
                                        "/api/user_auth/login",
                                        "/api/user_auth/forgotPassword",
                                        "/api/user_auth/resetPassword"
                                ).permitAll()
// Admin access
                                .requestMatchers("/admin/**")
                                .hasRole("ADMIN")

// Parts - administrative actions only for Manager/Admin
                                .requestMatchers("/parts/**")
                                .hasAnyRole("ADMIN", "MANAGER")

// Part usage - technicians can use parts on work orders
                                .requestMatchers("/part-usage/**")
                                .hasAnyRole("ADMIN", "MANAGER", "TECHNICIAN")

                                        // Customer management
                                        .requestMatchers("/customers/**")
                                        .hasRole("MANAGER")
// Service requests
                                .requestMatchers("/service-requests/**")
                                .hasAnyRole("CUSTOMER", "DISPATCHER", "MANAGER")
                                        // Customer can view only their own work orders
                                        .requestMatchers(
                                                HttpMethod.GET,
                                                "/work-orders/my-work-orders"
                                        ).hasRole("CUSTOMER")

// Other work-order APIs
                                        .requestMatchers("/work-orders/**")
                                        .hasAnyRole(
                                                "ADMIN",
                                                "MANAGER",
                                                "DISPATCHER",
                                                "TECHNICIAN"
                                        )
// Dashboard
                                .requestMatchers("/dashboard/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "MANAGER",
                                        "DISPATCHER"
                                )

// Everything else requires authentication
                                .anyRequest().authenticated()
                        )


                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}