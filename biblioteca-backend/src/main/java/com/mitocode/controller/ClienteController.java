package com.mitocode.controller;

import com.mitocode.dto.ClienteDTO;
import com.mitocode.model.Cliente;
import com.mitocode.service.IClienteService;
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
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final IClienteService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listar()  {
        List<ClienteDTO> lista = service.findAll().stream()
                .map(this::convertToDto)
                .toList();
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> listarPorId(@PathVariable("id") Integer id)  {
        Cliente obj = service.findById(id);
        return new ResponseEntity<>(convertToDto(obj), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Cliente> registrar(@Valid @RequestBody ClienteDTO clientedto)  {
        clientedto.setIdCliente(null);
        Cliente obj = service.save(convertToEntity(clientedto));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdCliente()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> modificar(@PathVariable Integer id, @Valid @RequestBody ClienteDTO dto) throws Exception {
        Cliente obj = service.update(id, convertToEntity(dto));
        return ResponseEntity.ok(convertToDto(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Cliente convertToEntity(ClienteDTO dto) {
        return defaultMapper.map(dto, Cliente.class);
    }

    private ClienteDTO convertToDto(Cliente entity) {
        return defaultMapper.map(entity, ClienteDTO.class);
    }
}
