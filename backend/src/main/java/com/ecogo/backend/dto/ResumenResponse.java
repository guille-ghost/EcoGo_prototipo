package com.ecogo.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

public record ResumenResponse(
        long solicitudesTotales,
        long pendientes,
        long asignadas,
        long enCamino,
        long completadas,
        BigDecimal kgRecogidos,
        Map<String, Long> porMaterial
) {}
