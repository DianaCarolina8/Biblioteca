import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Libro } from '../model/libro';
import { GenericService } from './generic.service';

@Service()
export class LibroService extends GenericService<Libro> {

    protected override url: string = `${environment.HOST}/libros`;


}
