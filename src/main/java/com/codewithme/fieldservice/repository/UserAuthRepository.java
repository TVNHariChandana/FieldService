
package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {

    Optional<UserAuth> findByUsername(String username);

    Optional<UserAuth> findByEmail(String email);
}