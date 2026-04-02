package com.alpharecon.usermanagement.service;

import com.alpharecon.usermanagement.dto.request.UserRequestDto;
import com.alpharecon.usermanagement.dto.response.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto createUser(UserRequestDto request);

    UserResponseDto getUserById(Long id);

    List<UserResponseDto> getAllUsers();

    UserResponseDto updateUser(Long id, UserRequestDto request);

    void deleteUser(Long id);
}
