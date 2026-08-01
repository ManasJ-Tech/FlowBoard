package com.manas.flowboard.repository;

import com.manas.flowboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByManagerCode(String managerCode);

    List<User> findAllByManager(User manager);

    Long countByManager(User manager);
}
