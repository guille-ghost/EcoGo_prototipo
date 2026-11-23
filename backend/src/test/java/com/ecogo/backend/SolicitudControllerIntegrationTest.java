package com.ecogo.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SolicitudControllerIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    void debeListarSolicitudes() throws Exception {
        mockMvc.perform(get("/api/solicitudes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    void debeCrearAsignarYCompletarSolicitud() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "material", "PAPEL",
                "cantidadKg", 10,
                "direccion", "Calle Prueba 123",
                "fechaRecojo", LocalDate.now().plusDays(5).toString(),
                "observaciones", "Prueba de integración",
                "solicitanteId", 1
        ));

        mockMvc.perform(post("/api/solicitudes").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado", is("PENDIENTE")))
                .andExpect(jsonPath("$.codigo").exists());
    }

    @Test
    void debeRechazarTransicionNoPermitida() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("estado", "COMPLETADA", "cantidadRecogidaKg", 5));
        mockMvc.perform(patch("/api/solicitudes/ECO-1048/estado").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void debeValidarCamposObligatorios() throws Exception {
        mockMvc.perform(post("/api/solicitudes").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.material").exists());
    }
}
