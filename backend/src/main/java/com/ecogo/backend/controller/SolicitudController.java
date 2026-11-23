package com.ecogo.backend.controller;

import com.ecogo.backend.domain.EstadoSolicitud;
import com.ecogo.backend.dto.ActualizarEstadoRequest;
import com.ecogo.backend.dto.AsignarSolicitudRequest;
import com.ecogo.backend.dto.CrearSolicitudRequest;
import com.ecogo.backend.dto.SolicitudResponse;
import com.ecogo.backend.service.SolicitudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;

    @GetMapping
    public List<SolicitudResponse> listar(
            @RequestParam(required = false) EstadoSolicitud estado,
            @RequestParam(required = false) Long solicitanteId,
            @RequestParam(required = false) Long recolectorId,
            @RequestParam(required = false) String buscar) {
        return solicitudService.listar(estado, solicitanteId, recolectorId, buscar);
    }

    @GetMapping("/{codigo}")
    public SolicitudResponse obtener(@PathVariable String codigo) {
        return solicitudService.obtener(codigo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolicitudResponse crear(@Valid @RequestBody CrearSolicitudRequest request) {
        return solicitudService.crear(request);
    }

    @PatchMapping("/{codigo}/asignar")
    public SolicitudResponse asignar(@PathVariable String codigo, @Valid @RequestBody AsignarSolicitudRequest request) {
        return solicitudService.asignar(codigo, request);
    }

    @PatchMapping("/{codigo}/estado")
    public SolicitudResponse actualizarEstado(@PathVariable String codigo, @Valid @RequestBody ActualizarEstadoRequest request) {
        return solicitudService.actualizarEstado(codigo, request);
    }
}
