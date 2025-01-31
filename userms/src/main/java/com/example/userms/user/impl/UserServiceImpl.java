package com.example.userms.user.impl;

import com.example.userms.user.LoginRequest;
import com.example.userms.user.User;
import com.example.userms.user.UserRepository;
import com.example.userms.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository=userRepository;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void createUser(User user) {
        userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public boolean updateUser(Long id, User updatedUser) {
        Optional<User> userOptional=userRepository.findById(id);
        if(userOptional.isPresent()) {
            User user=userOptional.get();
            user.setName(updatedUser.getName());
            user.setRole(updatedUser.getRole());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteUserById(Long id) {
        try {
            userRepository.deleteById(id);
            return true;
        }catch (Exception E) {
            return false;
        }
    }


    @Override
    public User validateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        System.out.println("Received email: " + loginRequest.getEmail());
        System.out.println("Received password: " + loginRequest.getPassword());

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            loginRequest.setRole(user.getRole());
            return user;
        }
        return null;
    }

}
