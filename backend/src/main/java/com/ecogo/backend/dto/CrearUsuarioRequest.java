package com.ecogo.backend.dto;

import com.ecogo.backend.domain.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CrearUsuarioRequest(
        @NotBlank @Size(max = 120) String nombre,
        @NotBlank @Email @Size(max = 160) String correo,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotNull RolUsuario rol
) {}
