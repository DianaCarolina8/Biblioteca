import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reserva } from '../model/reserva';
import { GenericService } from './generic.service';
import { ReservaLibroDTO } from '../model/reserva-libro';
import { Observable } from 'rxjs';
import { FiltroReservaDTO } from '../model/filter-reserva-dto';
import { Libro } from '../model/libro';

@Injectable()
export class ReservaService extends GenericService<Reserva> {

    protected override url: string = `${environment.HOST}/reservas`;

    guardarTransaccion(reservaLibroDTO: ReservaLibroDTO): Observable<any> {
        return this.http.post(this.url, reservaLibroDTO);
    }

    buscarPorCliente(filtro: FiltroReservaDTO): Observable<Reserva[]> {
        return this.http.post<Reserva[]>(`${this.url}/busqueda/cliente`, filtro);
    }

    buscarPorFechas(fecha1: string, fecha2: string): Observable<Reserva[]> {
        return this.http.get<Reserva[]>(`${this.url}/busqueda/fechas`, { params: { fecha1, fecha2 } });
    }

    detallesUrl(idReserva: number) {
        return `${environment.HOST}/detallereservas/${idReserva}`;
    }

    getLibrosByReserva(idReserva: number): Observable<Libro[]> {
        return this.http.get<Libro[]>(`${environment.HOST}/detallereservas/${idReserva}`);
    }
}
