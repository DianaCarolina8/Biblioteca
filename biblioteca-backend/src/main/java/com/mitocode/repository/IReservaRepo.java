package com.mitocode.repository;

import com.mitocode.model.Reserva;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface IReservaRepo extends IGenericRepo<Reserva, Integer> {

    @Query("FROM Reserva r WHERE r.cliente.cedula = :cedula OR LOWER(r.cliente.nombres) LIKE %:nombres% OR LOWER(r.cliente.apellidos) LIKE %:nombres%")
    List<Reserva> buscarPorCliente(@Param("cedula") String cedula, @Param("nombres") String nombres);

    @Query("FROM Reserva r WHERE r.fechaReserva BETWEEN :date1 AND :date2")
    List<Reserva> buscarPorFechas(@Param("date1") LocalDateTime date1, @Param("date2") LocalDateTime date2);

}
