package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

	@Autowired
    private final UserRepository userRepository;
	
	@Autowired
    private final PasswordEncoder passwordEncoder;
	
	@Autowired
    private final RoleRepository roleRepository;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public User registerUser(String username, String password, String role) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        User savedUser = userRepository.save(user);

        // Thêm role mặc định là USER nếu không có role được chỉ định
        Role userRole = new Role();
        userRole.setUsername(username);
        userRole.setRole(role != null && !role.isEmpty() ? role : "USER");
        roleRepository.save(userRole);

        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}