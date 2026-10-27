import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormField, FormRoot } from '@angular/forms/signals';
import { ReservaWizardForm } from '../../forms/reserva-wizard.form';
import { ReservaWizardStore } from '../../store/reserva-wizard.store';
import { ClienteService } from '../../services/cliente.service';
import { LibroService } from '../../services/libro.service';
import { ReservaService } from '../../services/reserva.service';
import { Cliente } from '../../model/cliente';
import { Libro } from '../../model/libro';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-reserva-wizard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    FormRoot,
    FormField
  ],
  templateUrl: './reserva-wizard.component.html',
  styleUrl: './reserva-wizard.component.css',
  providers: [ReservaWizardForm, ReservaWizardStore, ReservaService]
})
export class ReservaWizardComponent implements OnInit {

  protected readonly reservaWizardForm = inject(ReservaWizardForm);
  protected readonly reservaWizardStore = inject(ReservaWizardStore);
  private readonly clienteService = inject(ClienteService);
  private readonly libroService = inject(LibroService);
  private readonly reservaService = inject(ReservaService);
  private readonly snackBar = inject(MatSnackBar);

  protected clientes: Cliente[] = [];
  protected libros: Libro[] = [];
  protected filteredLibros$: Observable<Libro[]>;
  protected libroSearchCtrl = signal<string>('');

  protected today = new Date();

  protected $librosSeleccionados = this.reservaWizardStore.$librosSeleccionados;

  ngOnInit() {
    this.clienteService.findAll().subscribe(data => {
      this.clientes = data;
    });
    this.libroService.findAll().subscribe(data => {
      this.libros = data;
    });
    this.filteredLibros$ = this.filtrarLibros();
  }

  private filtrarLibros(): Observable<Libro[]> {
    return new Observable<Libro[]>(observer => {
      // Simple filtering
      const search = this.libroSearchCtrl().toLowerCase();
      if (!search) {
        observer.next(this.libros);
        return;
      }
      observer.next(this.libros.filter(l => 
        l.titulo.toLowerCase().includes(search) || l.autor.toLowerCase().includes(search)
      ));
    });
  }

  onLibroSearchChange(value: string) {
    this.libroSearchCtrl.set(value || '');
    this.filteredLibros$ = this.filtrarLibros();
  }

  agregarLibro(libro: Libro) {
    if (!libro) return;
    this.reservaWizardStore.addLibro(libro);
    this.libroSearchCtrl.set('');
    this.filteredLibros$ = this.filtrarLibros();
  }

  quitarLibro(idLibro: number) {
    this.reservaWizardStore.removeLibro(idLibro);
  }

  guardar() {
    if (this.reservaWizardForm.isInvalid()) {
      return;
    }
    if (this.$librosSeleccionados().length === 0) {
      return;
    }

    const formValue = this.reservaWizardForm.value();
    const fechaReserva = formValue.fechaReserva instanceof Date 
      ? formValue.fechaReserva.toISOString() 
      : formValue.fechaReserva;

    const dto = {
      reserva: {
        idReserva: null,
        fechaReserva: fechaReserva,
        cliente: formValue.cliente!
      },
      libros: this.$librosSeleccionados()
    };

    this.reservaService.guardarTransaccion(dto).subscribe({
      next: () => {
        this.snackBar.open('Reserva creada exitosamente', 'INFO', { 
          duration: 3000, 
          horizontalPosition: 'left', 
          verticalPosition: 'top' 
        });
        this.reset();
      },
      error: (err) => {
        this.snackBar.open('Error al crear la reserva', 'ERROR', { 
          duration: 3000, 
          horizontalPosition: 'left', 
          verticalPosition: 'top' 
        });
      }
    });
  }

  reset() {
    this.reservaWizardForm.reset();
    this.reservaWizardStore.clear();
    this.libroSearchCtrl.set('');
    this.filteredLibros$ = this.filtrarLibros();
  }
}
