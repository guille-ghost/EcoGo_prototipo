package com.ecogo.backend.dto;

import com.ecogo.backend.domain.EstadoSolicitud;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ActualizarEstadoRequest(
        @NotNull EstadoSolicitud estado,
        @DecimalMin(value = "0.0", inclusive = false) @Digits(integer = 8, fraction = 2) BigDecimal cantidadRecogidaKg,
        String observaciones
) {}
