package com.ecogo.backend.service;

import com.ecogo.backend.domain.EstadoSolicitud;
import com.ecogo.backend.domain.RolUsuario;
import com.ecogo.backend.dto.ActualizarEstadoRequest;
import com.ecogo.backend.dto.AsignarSolicitudRequest;
import com.ecogo.backend.dto.CrearSolicitudRequest;
import com.ecogo.backend.dto.SolicitudResponse;
import com.ecogo.backend.entity.Solicitud;
import com.ecogo.backend.entity.Usuario;
import com.ecogo.backend.exception.ReglaNegocioException;
import com.ecogo.backend.exception.RecursoNoEncontradoException;
import com.ecogo.backend.repository.SolicitudRepository;
import com.ecogo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;
    private final AtomicInteger sequence = new AtomicInteger(1050);

    @Transactional(readOnly = true)
    public List<SolicitudResponse> listar(EstadoSolicitud estado, Long solicitanteId, Long recolectorId, String buscar) {
        return solicitudRepository.findAll().stream()
                .filter(item -> estado == null || item.getEstado() == estado)
                .filter(item -> solicitanteId == null || item.getSolicitante().getId().equals(solicitanteId))
                .filter(item -> recolectorId == null || (item.getRecolector() != null && item.getRecolector().getId().equals(recolectorId)))
                .filter(item -> buscar == null || buscar.isBlank() || coincideBusqueda(item, buscar))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SolicitudResponse obtener(String codigo) {
        return toResponse(findByCodigo(codigo));
    }

    public SolicitudResponse crear(CrearSolicitudRequest request) {
        Usuario solicitante = usuarioRepository.findById(request.solicitanteId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el solicitante indicado"));
        if (solicitante.getRol() != RolUsuario.CIUDADANO) {
            throw new ReglaNegocioException("El solicitante debe tener rol CIUDADANO");
        }
        Solicitud solicitud = Solicitud.builder()
                .codigo(generarCodigo())
                .material(request.material())
                .cantidadKg(request.cantidadKg())
                .direccion(request.direccion())
                .fechaRecojo(request.fechaRecojo())
                .observaciones(request.observaciones())
                .estado(EstadoSolicitud.PENDIENTE)
                .solicitante(solicitante)
                .build();
        return toResponse(solicitudRepository.save(solicitud));
    }

    public SolicitudResponse asignar(String codigo, AsignarSolicitudRequest request) {
        Solicitud solicitud = findByCodigo(codigo);
        validarEstado(solicitud, EstadoSolicitud.PENDIENTE);
        Usuario recolector = usuarioRepository.findById(request.recolectorId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el recolector indicado"));
        if (recolector.getRol() != RolUsuario.RECOLECTOR || !Boolean.TRUE.equals(recolector.getActivo())) {
            throw new ReglaNegocioException("El usuario seleccionado no es un recolector activo");
        }
        solicitud.setRecolector(recolector);
        solicitud.setFechaRecojo(request.fechaRecojo());
        solicitud.setEstado(EstadoSolicitud.ASIGNADA);
        return toResponse(solicitudRepository.save(solicitud));
    }

    public SolicitudResponse actualizarEstado(String codigo, ActualizarEstadoRequest request) {
        Solicitud solicitud = findByCodigo(codigo);
        validarTransicion(solicitud.getEstado(), request.estado());
        if (request.estado() == EstadoSolicitud.COMPLETADA && request.cantidadRecogidaKg() == null) {
            throw new ReglaNegocioException("La cantidad recogida es obligatoria al completar el servicio");
        }
        solicitud.setEstado(request.estado());
        if (request.cantidadRecogidaKg() != null) solicitud.setCantidadRecogidaKg(request.cantidadRecogidaKg());
        if (request.observaciones() != null && !request.observaciones().isBlank()) solicitud.setObservaciones(request.observaciones());
        return toResponse(solicitudRepository.save(solicitud));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> resumen() {
        List<Solicitud> solicitudes = solicitudRepository.findAll();
        BigDecimal kg = solicitudes.stream().map(Solicitud::getCantidadRecogidaKg).filter(java.util.Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Long> porMaterial = Arrays.stream(com.ecogo.backend.domain.Material.values()).collect(java.util.stream.Collectors.toMap(Enum::name,
                material -> solicitudes.stream().filter(s -> s.getMaterial() == material).count(), (a, b) -> a, java.util.LinkedHashMap::new));
        return Map.of("solicitudesTotales", solicitudes.size(), "pendientes", count(solicitudes, EstadoSolicitud.PENDIENTE), "asignadas", count(solicitudes, EstadoSolicitud.ASIGNADA), "enCamino", count(solicitudes, EstadoSolicitud.EN_CAMINO), "completadas", count(solicitudes, EstadoSolicitud.COMPLETADA), "kgRecogidos", kg, "porMaterial", porMaterial);
    }

    private long count(List<Solicitud> solicitudes, EstadoSolicitud estado) { return solicitudes.stream().filter(s -> s.getEstado() == estado).count(); }

    private boolean coincideBusqueda(Solicitud item, String buscar) {
        String query = buscar.toLowerCase(Locale.ROOT);
        return item.getCodigo().toLowerCase(Locale.ROOT).contains(query)
                || item.getMaterial().name().toLowerCase(Locale.ROOT).contains(query)
                || item.getDireccion().toLowerCase(Locale.ROOT).contains(query);
    }

    private String generarCodigo() { return "ECO-" + sequence.getAndIncrement(); }

    private Solicitud findByCodigo(String codigo) {
        return solicitudRepository.findByCodigo(codigo).orElseThrow(() -> new RecursoNoEncontradoException("No existe la solicitud " + codigo));
    }

    private void validarEstado(Solicitud solicitud, EstadoSolicitud esperado) {
        if (solicitud.getEstado() != esperado) throw new ReglaNegocioException("La solicitud debe estar en estado " + esperado);
    }

    private void validarTransicion(EstadoSolicitud actual, EstadoSolicitud nuevo) {
        boolean permitida = (actual == EstadoSolicitud.ASIGNADA && nuevo == EstadoSolicitud.EN_CAMINO)
                || (actual == EstadoSolicitud.EN_CAMINO && nuevo == EstadoSolicitud.COMPLETADA)
                || (actual == nuevo);
        if (!permitida) throw new ReglaNegocioException("Transición no permitida: " + actual + " -> " + nuevo);
    }

    private SolicitudResponse toResponse(Solicitud item) {
        return new SolicitudResponse(item.getId(), item.getCodigo(), item.getMaterial(), item.getCantidadKg(), item.getDireccion(), item.getFechaRecojo(), item.getObservaciones(), item.getEstado(), item.getCantidadRecogidaKg(), resumen(item.getSolicitante()), item.getRecolector() == null ? null : resumen(item.getRecolector()), item.getCreadoEn(), item.getActualizadoEn());
    }

    private SolicitudResponse.UsuarioResumen resumen(Usuario usuario) {
        return new SolicitudResponse.UsuarioResumen(usuario.getId(), usuario.getNombre(), usuario.getCorreo());
    }
}
