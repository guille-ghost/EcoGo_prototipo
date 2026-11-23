package com.ecogo.backend.dto;

import com.ecogo.backend.domain.RolUsuario;

public record UsuarioResponse(Long id, String nombre, String correo, RolUsuario rol, Boolean activo) {}
