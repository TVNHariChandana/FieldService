
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.dto.AuthResponseDTO;
import com.codewithme.fieldservice.dto.LoginRequestDTO;
import com.codewithme.fieldservice.dto.RegisterRequestDTO;
import com.codewithme.fieldservice.model.UserAuth;
import com.codewithme.fieldservice.service.UserAuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user_auth")
public class UserAuthController {

    private final UserAuthService userAuthService;

    public UserAuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    @PostMapping("/register")
    public UserAuth register(@RequestBody RegisterRequestDTO request) {
        return userAuthService.register(request);
    }
    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO request){
        return userAuthService.login(request);
    }
    @PostMapping("/forgotPassword")
    public String forgotPassword(@RequestParam String email) {
        userAuthService.forgotPassword(email);
        return "Password reset link generated";
    }
    @PostMapping("/resetPassword")
    public String resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        userAuthService.resetPassword(token, newPassword);

        return "Password reset successful";
    }
    @PostMapping("/loggedOut")
    public String logout(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);

        userAuthService.logout(token);

        return "Logout successful";
    }
}