import { inject, Service } from "@angular/core";
import { CategoriaService } from "../services/categoria.service";
import { httpResource } from "@angular/common/http";
import { Categoria } from "../model/categoria";

@Service({autoProvided: false})
export class CategoriaStore{

    private readonly categoriaService = inject(CategoriaService);

    readonly categoriaResource = httpResource<Categoria[]>( () => this.categoriaService.resourceUrl, { defaultValue: [] });

    readonly $categorias = this.categoriaResource.value;
    readonly $loading = this.categoriaResource.isLoading;
    readonly $error = this.categoriaResource.error;

    reload(){
        this.categoriaResource.reload();
    }

}