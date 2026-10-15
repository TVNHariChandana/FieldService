package com.codewithme.fieldservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final TokenBlockService tokenBlockService;

    public JwtAuthenticationFilter(
            JWTUtil jwtUtil,
            UserDetailsService userDetailsService,
            TokenBlockService tokenBlockService) {

        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.tokenBlockService = tokenBlockService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        System.out.println("REQUEST: " + request.getRequestURI());
        System.out.println("AUTH HEADER: " + authorizationHeader);

        if (authorizationHeader != null
                && authorizationHeader.startsWith("Bearer ")) {

            System.out.println("BEARER TOKEN FOUND");

            String token = authorizationHeader.substring(7);

            if (!tokenBlockService.isTokenBlocked(token)
                    && jwtUtil.isTokenValid(token)) {

                System.out.println("TOKEN IS VALID");

                String username = jwtUtil.extractUsername(token);

                System.out.println("USERNAME: " + username);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                System.out.println(
                        "AUTHORITIES: " + userDetails.getAuthorities()
                );

                // keep the rest of your existing code
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            }
        }

        filterChain.doFilter(request, response);
    }
}