
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.dto.AuthResponseDTO;
import com.codewithme.fieldservice.dto.LoginRequestDTO;
import com.codewithme.fieldservice.dto.RegisterRequestDTO;
import com.codewithme.fieldservice.model.Role;
import com.codewithme.fieldservice.model.UserAuth;
import com.codewithme.fieldservice.repository.UserAuthRepository;
import com.codewithme.fieldservice.security.EmailLogService;
import com.codewithme.fieldservice.security.JWTUtil;
import com.codewithme.fieldservice.security.TokenBlockService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;
@Service
public class UserAuthService {

    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final EmailLogService emailLogService;
    private final TokenBlockService tokenBlockService;

    public UserAuthService(
            UserAuthRepository userAuthRepository,
            PasswordEncoder passwordEncoder, JWTUtil jwtUtil, EmailLogService emailLogService, TokenBlockService tokenBlockService) {

        this.userAuthRepository = userAuthRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailLogService = emailLogService;
        this.tokenBlockService = tokenBlockService;
    }

    public UserAuth register(RegisterRequestDTO request) {

        UserAuth user = new UserAuth();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(
                Role.valueOf(request.getRole().toUpperCase())
        );
        return userAuthRepository.save(user);
    }
    public AuthResponseDTO login(LoginRequestDTO request) {

        UserAuth user = userAuthRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().name());

        return response;
    }
    public void forgotPassword(String email) {

        UserAuth user = userAuthRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String resetToken = UUID.randomUUID().toString();

        user.setResetToken(resetToken);

        user.setResetTokenExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        userAuthRepository.save(user);

        emailLogService.sendResetPasswordEmail(
                user.getEmail(),
                resetToken
        );
    }
    public void resetPassword(String token, String newPassword) {

        UserAuth user = userAuthRepository
                .findAll()
                .stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Invalid reset token"));

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Reset token expired");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userAuthRepository.save(user);
    }
    public void logout(String token){
        tokenBlockService.blockToken(token);
    }
}