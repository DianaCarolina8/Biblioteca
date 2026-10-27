package com.mitocode.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaLibroDTO {

    @JsonBackReference
    private ReservaDTO reserva;

    @NotNull
    private List<LibroDTO> libros;
}
