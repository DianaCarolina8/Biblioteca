package com.mitocode.controller;

import com.mitocode.dto.CategoriaDTO;
import com.mitocode.model.Categoria;
import com.mitocode.service.ICategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final ICategoriaService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<Categoria>> listar()  {
        List<Categoria> lista = service.findAll();
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> listarPorId(@PathVariable("id") Integer id) {
        Categoria obj = service.findById(id);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Categoria> registrar(@RequestBody CategoriaDTO categoriadto)  {
        Categoria obj = service.save(convertToEntity(categoriadto));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdCategoria()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> modificar(@PathVariable Integer id, @Valid @RequestBody CategoriaDTO dto ) throws Exception{
        Categoria obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hateoas/{id}")
    public EntityModel<CategoriaDTO> findByIdHateoas(@PathVariable Integer id){
        Categoria obj = service.findById(id);

        EntityModel<CategoriaDTO> entityModel = EntityModel.of(convertToDto(obj));

        WebMvcLinkBuilder link1 = linkTo(methodOn(CategoriaController.class).listarPorId(id));
        WebMvcLinkBuilder link2 = linkTo(methodOn(CategoriaController.class).listar());
        WebMvcLinkBuilder link3 = linkTo(methodOn(LanguageController.class).changeLanguage("ES"));

        entityModel.add(link1.withRel("categoria-details"));
        entityModel.add(link2.withRel("todas-categorias"));
        entityModel.add(link3.withRel("ES-language"));

        return entityModel;
    }

    private Categoria convertToEntity(CategoriaDTO dto){
        return defaultMapper.map(dto, Categoria.class);
    }
    private CategoriaDTO convertToDto(Categoria entity){
        return defaultMapper.map(entity, CategoriaDTO.class);
    }
}