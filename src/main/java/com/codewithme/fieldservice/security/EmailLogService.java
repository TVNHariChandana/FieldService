
package com.codewithme.fieldservice.security;

import org.springframework.stereotype.Service;

@Service
public class EmailLogService {

    public String sendResetPasswordEmail(String email, String token) {

        String resetPasswordLink =
                "http://localhost:8080/api/user_auth/resetPassword?token=" + token;

        System.out.println("Password reset link: " + resetPasswordLink);

        return "Reset password link generated";
    }
}