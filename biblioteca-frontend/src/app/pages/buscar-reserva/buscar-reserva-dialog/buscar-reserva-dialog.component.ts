import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-buscar-reserva-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatListModule, CommonModule],
  providers: [ReservaService],
  templateUrl: './buscar-reserva-dialog.component.html',
  styleUrl: './buscar-reserva-dialog.component.css'
})
export class BuscarReservaDialogComponent {

  private readonly dialogRef = inject(MatDialogRef<BuscarReservaDialogComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  private readonly reservaService = inject(ReservaService);

  protected libros = signal<any[]>([]);

  constructor() {
    if (this.data?.idReserva) {
      this.reservaService.getLibrosByReserva(this.data.idReserva).subscribe(libros => {
        this.libros.set(libros);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
