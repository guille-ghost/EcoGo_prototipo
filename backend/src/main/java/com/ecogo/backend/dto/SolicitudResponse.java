package com.ecogo.backend.dto;

import com.ecogo.backend.domain.EstadoSolicitud;
import com.ecogo.backend.domain.Material;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SolicitudResponse(
        Long id,
        String codigo,
        Material material,
        BigDecimal cantidadKg,
        String direccion,
        LocalDate fechaRecojo,
        String observaciones,
        EstadoSolicitud estado,
        BigDecimal cantidadRecogidaKg,
        UsuarioResumen solicitante,
        UsuarioResumen recolector,
        LocalDateTime creadoEn,
        LocalDateTime actualizadoEn
) {
    public record UsuarioResumen(Long id, String nombre, String correo) {}
}
