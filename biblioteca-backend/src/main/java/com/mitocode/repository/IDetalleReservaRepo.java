package com.mitocode.repository;

import com.mitocode.model.DetalleReserva;
import com.mitocode.model.DetalleReservaPK;
import com.mitocode.model.Libro;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IDetalleReservaRepo extends IGenericRepo<DetalleReserva, DetalleReservaPK> {

    @Query("SELECT dr.libro FROM DetalleReserva dr WHERE dr.reserva.idReserva = :idReserva")
    List<Libro> getLibrosByReservaId(@Param("idReserva") Integer idReserva);

}
