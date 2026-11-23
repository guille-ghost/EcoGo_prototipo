package com.ecogo.backend;

import com.ecogo.backend.domain.EstadoSolicitud;
import com.ecogo.backend.exception.ReglaNegocioException;
import com.ecogo.backend.repository.SolicitudRepository;
import com.ecogo.backend.repository.UsuarioRepository;
import com.ecogo.backend.service.SolicitudService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class SolicitudServiceTest {

    @Test
    void unaTransicionInvalidaDebeGenerarReglaDeNegocio() {
        var service = new SolicitudService(org.mockito.Mockito.mock(SolicitudRepository.class), org.mockito.Mockito.mock(UsuarioRepository.class));
        var solicitud = com.ecogo.backend.entity.Solicitud.builder().codigo("ECO-1048").estado(EstadoSolicitud.PENDIENTE).build();
        var repository = org.mockito.Mockito.mock(SolicitudRepository.class);
        org.mockito.Mockito.when(repository.findByCodigo("ECO-1048")).thenReturn(java.util.Optional.of(solicitud));
        var serviceWithData = new SolicitudService(repository, org.mockito.Mockito.mock(UsuarioRepository.class));
        assertThrows(ReglaNegocioException.class, () -> serviceWithData.actualizarEstado("ECO-1048", new com.ecogo.backend.dto.ActualizarEstadoRequest(EstadoSolicitud.COMPLETADA, java.math.BigDecimal.ONE, null)));
    }
}
