package com.mitocode.service.impl;

import com.mitocode.model.DetalleReserva;
import com.mitocode.model.Libro;
import com.mitocode.model.Reserva;
import com.mitocode.repository.IDetalleReservaRepo;
import com.mitocode.repository.IGenericRepo;
import com.mitocode.repository.IReservaLibroRepo;
import com.mitocode.repository.IReservaRepo;
import com.mitocode.service.IReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class ReservaServiceImpl extends CRUDImpl<Reserva, Integer> implements IReservaService {

    private final IReservaRepo reservaRepo;
    private final IReservaLibroRepo reservaLibroRepo;
    private final IDetalleReservaRepo detalleReservaRepo;

    @Override
    protected IGenericRepo<Reserva, Integer> getRepo() {
        return reservaRepo;
    }

    @Transactional
    @Override
    public Reserva guardarTransaccion(Reserva reserva, List<Integer> listaIdLibros) {
        if (listaIdLibros.stream().anyMatch(Objects::isNull)) {
            throw new IllegalArgumentException("CODIGO DE LIBRO ES REQUERIDO");
        }

        Reserva obj = reservaRepo.save(reserva);

        List<DetalleReserva> rows = listaIdLibros.stream()
                .distinct()
                .map(idLibro -> {
                    Libro libro = new Libro();
                    libro.setIdLibro(idLibro);
                    return new DetalleReserva(obj, libro);
                })
                .toList();

        reservaLibroRepo.saveAll(rows);

        return obj;
    }

    @Override
    public List<Reserva> buscarPorCliente(String cedula, String nombres) {
        String ced = cedula == null ? null : cedula;
        String nom = nombres == null ? "" : nombres.toLowerCase();
        return reservaRepo.buscarPorCliente(ced, nom);
    }

    @Override
    public List<Reserva> buscarPorFechas(LocalDateTime date1, LocalDateTime date2) {
        return reservaRepo.buscarPorFechas(date1, date2);
    }

    @Override
    public List<Libro> getLibrosByReserva(Integer idReserva) {
        return detalleReservaRepo.getLibrosByReservaId(idReserva);
    }

}
