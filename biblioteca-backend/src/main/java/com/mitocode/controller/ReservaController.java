package com.mitocode.controller;

import com.mitocode.dto.LibroDTO;
import com.mitocode.dto.ReservaDTO;
import com.mitocode.dto.ReservaLibroDTO;
import com.mitocode.model.Libro;
import com.mitocode.model.Reserva;
import com.mitocode.service.IReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequiredArgsConstructor
public class ReservaController {

    public record FiltroReserva(String cedula, String nombres) {
    }

    private final IReservaService service;
    private final ModelMapper consultMapper;

    @GetMapping("/reservas")
    public ResponseEntity<List<ReservaDTO>> findAll() {
        List<Reserva> list = service.findAll();
        List<ReservaDTO> dtoList = list.stream().map(this::convertToDto).toList();

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/reservas/{id}")
    public ResponseEntity<ReservaDTO> findById(@PathVariable Integer id) {
        Reserva obj = service.findById(id);

        return ResponseEntity.ok(convertToDto(obj));
    }

    @PostMapping("/reservas")
    public ResponseEntity<Void> save(@Valid @RequestBody ReservaLibroDTO dto) {
        Reserva reserva = convertToEntity(dto.getReserva());
        reserva.setIdReserva(null);

        List<Integer> listaIdLibros = dto.getLibros().stream().map(LibroDTO::getIdLibro).toList();

        Reserva obj = service.guardarTransaccion(reserva, listaIdLibros);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdReserva()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/reservas/{id}")
    public ResponseEntity<ReservaDTO> update(@PathVariable Integer id, @Valid @RequestBody ReservaDTO dto) throws Exception {
        Reserva obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/reservas/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reservas/busqueda/cliente")
    public ResponseEntity<List<ReservaDTO>> buscarPorCliente(@RequestBody FiltroReserva filtro) {
        List<Reserva> list = service.buscarPorCliente(filtro.cedula(), filtro.nombres());
        List<ReservaDTO> dtoList = list.stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/reservas/busqueda/fechas")
    public ResponseEntity<List<ReservaDTO>> buscarPorFechas(@RequestParam("fecha1") String fecha1,
                                                           @RequestParam("fecha2") String fecha2) {
        LocalDateTime date1 = LocalDateTime.parse(fecha1);
        LocalDateTime date2 = LocalDateTime.parse(fecha2);
        List<Reserva> list = service.buscarPorFechas(date1, date2);
        List<ReservaDTO> dtoList = list.stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/detallereservas/{idreserva}")
    public ResponseEntity<List<LibroDTO>> getLibrosPorReserva(@PathVariable("idreserva") Integer idreserva) {
        List<Libro> libros = service.getLibrosByReserva(idreserva);
        List<LibroDTO> dtoList = libros.stream().map(this::convertToLibroDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/reservas/hateoas/{id}")
    public EntityModel<ReservaDTO> findByIdHateoas(@PathVariable Integer id) {
        Reserva obj = service.findById(id);

        EntityModel<ReservaDTO> entityModel = EntityModel.of(convertToDto(obj));

        WebMvcLinkBuilder link1 = linkTo(methodOn(ReservaController.class).findById(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(ReservaController.class).findAll());
        WebMvcLinkBuilder link3 = linkTo(methodOn(LanguageController.class).changeLanguage("ES"));

        entityModel.add(link1.withRel("consult-details"));
        entityModel.add(link2.withRel("all-consults"));
        entityModel.add(link3.withRel("ES-language"));

        return entityModel;
    }

    private Reserva convertToEntity(ReservaDTO dto) {
        return consultMapper.map(dto, Reserva.class);
    }

    private ReservaDTO convertToDto(Reserva entity) {
        return consultMapper.map(entity, ReservaDTO.class);
    }

    private LibroDTO convertToLibroDto(Libro libro) {
        return consultMapper.map(libro, LibroDTO.class);
    }

}
