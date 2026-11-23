package com.ecogo.backend.repository;

import com.ecogo.backend.domain.RolUsuario;
import com.ecogo.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreoIgnoreCase(String correo);
    List<Usuario> findByRolAndActivoTrue(RolUsuario rol);
    boolean existsByCorreoIgnoreCase(String correo);
}
