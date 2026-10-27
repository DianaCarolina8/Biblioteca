import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Categoria } from '../model/categoria';
import { GenericService } from './generic.service';

@Service()
export class CategoriaService extends GenericService<Categoria> {
    
    protected override url: string = `${environment.HOST}/categorias`;

    
}

