
package com.codewithme.fieldservice.security;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TokenBlockService {

    private final Set<String> blockedTokens = new HashSet<>();

    public void blockToken(String token) {
        blockedTokens.add(token);
    }

    public boolean isTokenBlocked(String token) {
        return blockedTokens.contains(token);
    }
}