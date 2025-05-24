package com.Football.Tournament.services;

import com.Football.Tournament.entities.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    
    public User createUser(User user);
    
    public User updateUser(User user);
    
    public Optional<User> getUserById(Long id);
    
    public Optional<User> findByUsername(String username);
    
    public Optional<User> findByEmail(String email);
    
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail);
    
    public Page<User> getAllUsers(Pageable pageable);
    
    public List<User> getAllUsers();
    
    public boolean existsByUsername(String username);
    
    public boolean existsByEmail(String email);
    
    public void deleteUser(Long id);
}
