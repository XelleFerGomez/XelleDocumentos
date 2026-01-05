package com.xelle.flaskcontrol; // AJUSTA ESTO SEGÚN TU PROYECTO

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class FlaskControlApplication {
    public static void main(String[] args) {
        SpringApplication.run(FlaskControlApplication.class, args);
    }

    // Configuración CORS Global para permitir conexiones desde tu HTML local
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
            }
        };
    }
}

// --- ENTIDADES (Base de Datos) ---

@Entity
@Table(name = "recipientes")
@Data
class Recipiente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String linea;
    @Column(name = "fecha_fi")
    private LocalDate fechaFi;
    private Integer numero;
    
    // insertable=false, updatable=false porque lo llena el Trigger de SQL
    @Column(name = "codigo_completo", insertable = false, updatable = false)
    private String codigoCompleto;
    
    private Integer pasaje;
    private String tipo;
    private String estado; // activo, cosechado, desechado
    private String responsableCreacion;
    private String observaciones;
}

@Entity
@Table(name = "historial_movimientos")
@Data
class Movimiento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "recipiente_id")
    private Recipiente recipiente;
    
    private LocalDateTime fechaMovimiento;
    private Double celulasTotales;
    private Double viabilidad;
    private String destino;
    private String responsableMovimiento;
    private String observaciones;
}

// --- REPOSITORIOS ---

interface RecipienteRepository extends JpaRepository<Recipiente, Long> {
    List<Recipiente> findByEstado(String estado);
    
    // Verificar si existe duplicado (para validación extra)
    boolean existsByLineaAndFechaFiAndNumero(String linea, LocalDate fechaFi, Integer numero);
}

interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    // Para el dashboard: traer últimos movimientos
    List<Movimiento> findTop10ByOrderByFechaMovimientoDesc();
    
    @Query("SELECT SUM(m.celulasTotales) FROM Movimiento m")
    Double sumTotalCelulas();
    
    @Query("SELECT AVG(m.viabilidad) FROM Movimiento m")
    Double avgViability();
}

// --- CONTROLADOR (API) ---

@RestController
@RequestMapping("/api")
class ApiController {
    private final RecipienteRepository recipienteRepo;
    private final MovimientoRepository movimientoRepo;

    public ApiController(RecipienteRepository recipienteRepo, MovimientoRepository movimientoRepo) {
        this.recipienteRepo = recipienteRepo;
        this.movimientoRepo = movimientoRepo;
    }

    // 1. Guardar Recipiente
    @PostMapping("/recipientes")
    public ResponseEntity<?> guardarRecipiente(@RequestBody Recipiente r) {
        if (recipienteRepo.existsByLineaAndFechaFiAndNumero(r.getLinea(), r.getFechaFi(), r.getNumero())) {
            return ResponseEntity.badRequest().body("DUPLICADO: Ya existe un recipiente con esa Línea, Fecha y Número.");
        }
        return ResponseEntity.ok(recipienteRepo.save(r));
    }

    // 2. Obtener Activos
    @GetMapping("/recipientes/activos")
    public List<Recipiente> getActivos() {
        return recipienteRepo.findByEstado("activo");
    }

    // 3. Guardar Movimiento (Cosecha)
    @PostMapping("/movimientos")
    public ResponseEntity<?> guardarMovimiento(@RequestBody Map<String, Object> payload) {
        try {
            Long recipId = Long.valueOf(payload.get("recipienteId").toString());
            Recipiente recip = recipienteRepo.findById(recipId).orElseThrow();

            Movimiento mov = new Movimiento();
            mov.setRecipiente(recip);
            mov.setFechaMovimiento(LocalDateTime.now());
            mov.setCelulasTotales(Double.valueOf(payload.get("celulas").toString()));
            mov.setViabilidad(Double.valueOf(payload.get("viabilidad").toString()));
            mov.setDestino((String) payload.get("destino"));
            mov.setResponsableMovimiento((String) payload.get("responsable"));
            mov.setObservaciones((String) payload.get("observaciones"));
            
            movimientoRepo.save(mov);

            // Actualizar estado del frasco
            String nuevoEstado = (String) payload.get("nuevoEstadoRecipiente");
            if (nuevoEstado != null) {
                recip.setEstado(nuevoEstado);
                recipienteRepo.save(recip);
            }

            return ResponseEntity.ok("Guardado");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 4. Datos Dashboard
    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCelulas", movimientoRepo.sumTotalCelulas());
        stats.put("avgViabilidad", movimientoRepo.avgViability());
        stats.put("totalActivos", recipienteRepo.findByEstado("activo").size());
        stats.put("recientes", movimientoRepo.findTop10ByOrderByFechaMovimientoDesc());
        return stats;
    }
}