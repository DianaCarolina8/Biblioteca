package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LibroDTO {

    private Integer idLibro;

    @NotNull
    //@NotEmpty
    //@NotBlank
    @Size(min = 5, max = 150)
    private String titulo;

    @NotNull
    @Size(min = 5, max = 100)
    private String autor;

    @NotNull
    @Size(min = 5, max = 20)
    private String isbn;

    @NotNull
    private Boolean disponible;

    @NotNull
    private Integer idCategoria;




}
