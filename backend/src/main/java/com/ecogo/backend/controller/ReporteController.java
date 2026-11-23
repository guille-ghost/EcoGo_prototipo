package com.ecogo.backend.controller;

import com.ecogo.backend.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final SolicitudService solicitudService;

    @GetMapping("/resumen")
    public Map<String, Object> resumen() {
        return solicitudService.resumen();
    }
}
