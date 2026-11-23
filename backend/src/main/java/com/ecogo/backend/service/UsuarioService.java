package com.ecogo.backend.service;

import com.ecogo.backend.domain.RolUsuario;
import com.ecogo.backend.dto.CrearUsuarioRequest;
import com.ecogo.backend.dto.UsuarioResponse;
import com.ecogo.backend.entity.Usuario;
import com.ecogo.backend.exception.ReglaNegocioException;
import com.ecogo.backend.exception.RecursoNoEncontradoException;
import com.ecogo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar(RolUsuario rol) {
        return (rol == null ? usuarioRepository.findAll() : usuarioRepository.findByRolAndActivoTrue(rol))
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return toResponse(find(id));
    }

    public UsuarioResponse crear(CrearUsuarioRequest request) {
        if (usuarioRepository.existsByCorreoIgnoreCase(request.correo())) {
            throw new ReglaNegocioException("Ya existe un usuario con ese correo");
        }
        Usuario usuario = Usuario.builder().nombre(request.nombre()).correo(request.correo().toLowerCase()).password(request.password()).rol(request.rol()).activo(true).build();
        return toResponse(usuarioRepository.save(usuario));
    }

    private Usuario find(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + id));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol(), usuario.getActivo());
    }
}
