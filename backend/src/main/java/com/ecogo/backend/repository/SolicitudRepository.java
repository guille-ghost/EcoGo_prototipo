package com.ecogo.backend.repository;

import com.ecogo.backend.domain.EstadoSolicitud;
import com.ecogo.backend.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    Optional<Solicitud> findByCodigo(String codigo);
    List<Solicitud> findBySolicitanteIdOrderByCreadoEnDesc(Long solicitanteId);
    List<Solicitud> findByRecolectorIdOrderByFechaRecojoAsc(Long recolectorId);
    List<Solicitud> findByEstadoOrderByFechaRecojoAsc(EstadoSolicitud estado);
    long countByEstado(EstadoSolicitud estado);
}
