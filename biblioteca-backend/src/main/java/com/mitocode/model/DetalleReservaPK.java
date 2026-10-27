package com.mitocode.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class DetalleReservaPK {

    @ManyToOne
    @JoinColumn(name = "id_reserva", nullable = false, foreignKey = @ForeignKey(name = "fk_detalle_reserva_reserva"))
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "id_libro", nullable = false, foreignKey = @ForeignKey(name = "fk_detalle_reserva_libro"))
    private Libro libro;

}
