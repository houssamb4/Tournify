package com.Football.Tournament.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String role;
}
