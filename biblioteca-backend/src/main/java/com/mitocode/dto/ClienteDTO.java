package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteDTO {

    private Integer idCliente;

    @NotBlank
    @Size(max = 70)
    private String nombres;

    @NotBlank
    @Size(max = 70)
    private String apellidos;

    @NotBlank
    @Size(max = 20)
    private String cedula;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

}
