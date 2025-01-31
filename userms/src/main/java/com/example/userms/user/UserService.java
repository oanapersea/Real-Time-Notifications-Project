package com.example.userms.user;

import java.util.List;

public interface UserService {

    List<User> findAll();
    void createUser(User user);
    User getUserById(Long id);
    boolean updateUser(Long id, User user);
    boolean deleteUserById(Long id);
    User validateUser(LoginRequest loginRequest);

}
