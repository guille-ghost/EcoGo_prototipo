package com.ecogo.backend.config;

import com.ecogo.backend.domain.EstadoSolicitud;
import com.ecogo.backend.domain.Material;
import com.ecogo.backend.domain.RolUsuario;
import com.ecogo.backend.entity.Solicitud;
import com.ecogo.backend.entity.Usuario;
import com.ecogo.backend.repository.SolicitudRepository;
import com.ecogo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final SolicitudRepository solicitudRepository;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            if (usuarioRepository.count() > 0) return;
            Usuario ciudadano = usuarioRepository.save(Usuario.builder().nombre("Celia Casas").correo("celia@ecogo.pe").password("ecogo2026").rol(RolUsuario.CIUDADANO).build());
            Usuario recolector = usuarioRepository.save(Usuario.builder().nombre("Juan Pérez").correo("juan@ecogo.pe").password("ecogo2026").rol(RolUsuario.RECOLECTOR).build());
            usuarioRepository.save(Usuario.builder().nombre("María López").correo("maria@ecogo.pe").password("ecogo2026").rol(RolUsuario.ADMINISTRADOR).build());

            solicitudRepository.save(Solicitud.builder().codigo("ECO-1048").material(Material.CARTON).cantidadKg(new BigDecimal("12")).direccion("Av. Las Flores 430, Miraflores").fechaRecojo(LocalDate.now().plusDays(3)).observaciones("Cajas plegadas junto a la puerta principal.").estado(EstadoSolicitud.PENDIENTE).solicitante(ciudadano).build());
            solicitudRepository.save(Solicitud.builder().codigo("ECO-1047").material(Material.PLASTICO).cantidadKg(new BigDecimal("8")).direccion("Jr. Los Olivos 182, San Isidro").fechaRecojo(LocalDate.now().plusDays(2)).estado(EstadoSolicitud.ASIGNADA).solicitante(ciudadano).recolector(recolector).build());
            solicitudRepository.save(Solicitud.builder().codigo("ECO-1045").material(Material.VIDRIO).cantidadKg(new BigDecimal("22")).cantidadRecogidaKg(new BigDecimal("20")).direccion("Av. El Sol 215, Surco").fechaRecojo(LocalDate.now()).estado(EstadoSolicitud.COMPLETADA).solicitante(ciudadano).recolector(recolector).build());
        };
    }
}
