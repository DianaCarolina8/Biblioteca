package com.mitocode.controller;

import com.mitocode.dto.LibroDTO;
import com.mitocode.model.Cliente;
import com.mitocode.model.Libro;
import com.mitocode.service.ILibroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/libros")
@RequiredArgsConstructor
public class LibroController {

    private final ILibroService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<LibroDTO>> listar()  {
        List<Libro> list = service.findAll();
        List<LibroDTO> dtoList = list.stream().map(this::convertToDto).toList();
        return new ResponseEntity<>(dtoList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Libro> listarPorId(@PathVariable("id") Integer id)  {
        Libro obj = service.findById(id);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Libro> registrar(@RequestBody LibroDTO libroDTO)  {
        Libro obj = service.save(convertToEntity(libroDTO));
        System.out.println(obj.toString());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdLibro()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibroDTO> modificar(@PathVariable Integer id, @Valid @RequestBody LibroDTO dto ) throws Exception {
        Libro obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


    private Libro convertToEntity(LibroDTO dto){
        return defaultMapper.map(dto, Libro.class);
    }
    private LibroDTO convertToDto(Libro entity){
        return defaultMapper.map(entity, LibroDTO.class);
    }
}