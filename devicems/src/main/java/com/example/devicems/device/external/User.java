package com.example.devicems.device.external;

public class User {


    private Long id;
    private String name;
    private Long roleId;
    private String password;
    private String email;

    public User() {

    }

    public User(Long id, String name, String password, String email) {
        this.id=id;
        this.name=name;
        this.password=password;
        this.email=email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email=email;

    }

    public String getEmail() {
        return email;
    }
}
