package com.gymstack.backend.dto;

import com.gymstack.backend.model.AppRole;

public record AuthResponse(
        String username,
        AppRole role
) {
}

