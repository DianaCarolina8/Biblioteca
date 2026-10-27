import { Service, signal } from "@angular/core";
import { Libro } from "../model/libro";
import { form, minLength, required } from "@angular/forms/signals";

const emptyLibro = (): Libro => ({
    idLibro: null,
    titulo: '',
    autor: '',
    isbn: '',
    disponible: true,
    idCategoria: null
});

@Service({ autoProvided: false })
export class LibroForm {

    readonly model = signal<Libro>(emptyLibro());

    readonly form = form(this.model, (path) => {
        required(path.idCategoria);

        required(path.titulo);
        minLength(path.titulo, 3);

        required(path.autor);
        minLength(path.autor, 3);

        required(path.isbn);
        minLength(path.isbn, 3);

  });

  readonly isEdit = () => this.model().idLibro > 0;
  readonly isInvalid = () => this.form().invalid();

  patch(libro?: Libro) {
    this.model.set(libro ?? emptyLibro());
  }

  value(){
    return this.model();
  }
}