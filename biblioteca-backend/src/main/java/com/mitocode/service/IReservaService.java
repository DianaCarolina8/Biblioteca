package com.mitocode.service;

import com.mitocode.model.Libro;
import com.mitocode.model.Reserva;

import java.time.LocalDateTime;
import java.util.List;

public interface IReservaService extends ICRUD<Reserva, Integer> {

    Reserva guardarTransaccion(Reserva reserva, List<Integer> librosId);

    List<Reserva> buscarPorCliente(String cedula, String nombres);

    List<Reserva> buscarPorFechas(LocalDateTime date1, LocalDateTime date2);

    List<Libro> getLibrosByReserva(Integer idReserva);

}
