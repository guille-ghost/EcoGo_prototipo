package com.ecogo.backend.dto;

import com.ecogo.backend.domain.Material;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CrearSolicitudRequest(
        @NotNull Material material,
        @NotNull @DecimalMin(value = "0.1") @Digits(integer = 8, fraction = 2) BigDecimal cantidadKg,
        @NotBlank @Size(max = 240) String direccion,
        @NotNull @FutureOrPresent LocalDate fechaRecojo,
        @Size(max = 600) String observaciones,
        @NotNull @Positive Long solicitanteId
) {}
