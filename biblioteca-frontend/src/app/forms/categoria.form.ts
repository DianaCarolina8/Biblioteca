import { Service, signal } from "@angular/core";
import { Categoria } from "../model/categoria";
import { form, maxLength, minLength, required } from "@angular/forms/signals";

const emptyCategoria = ():Categoria => ({
    idCategoria: null,
    nombre: '',
    descripcion:  '',
    estado: true
});

@Service({ autoProvided: false})
export class CategoriaForm {

    readonly $model = signal<Categoria>(emptyCategoria());

    readonly $form = form(this.$model, (path) => {
        required(path.nombre);
        minLength(path.nombre, 3);
        maxLength(path.nombre, 100);

        required(path.descripcion);
        minLength(path.descripcion, 15);
        maxLength(path.descripcion, 100);
  });

  readonly isInvalid = () => this.$form().invalid();

  patch(categoria: Categoria){
    this.$model.set(categoria);
  }

  value(){
    return this.$model();
  }

  reset(){
    this.$model.set(emptyCategoria());
  }

}