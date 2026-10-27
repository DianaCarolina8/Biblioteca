import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { BuscarReservaForm } from '../../forms/buscar-reserva.form';
import { BuscarReservaStore } from '../../stores/buscar-reserva.store';
import { ReservaService } from '../../services/reserva.service';
import { BuscarReservaDialogComponent } from './buscar-reserva-dialog/buscar-reserva-dialog.component';

@Component({
  selector: 'app-buscar-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormRoot,
    FormField
  ],
  templateUrl: './buscar-reserva.component.html',
  styleUrl: './buscar-reserva.component.css',
  providers: [BuscarReservaForm, BuscarReservaStore, ReservaService]
})
export class BuscarReservaComponent implements OnInit {

  protected readonly buscarReservaForm = inject(BuscarReservaForm);
  protected readonly buscarReservaStore = inject(BuscarReservaStore);
  private readonly reservaService = inject(ReservaService);
  private readonly dialog = inject(MatDialog);

  protected selectedTabIndex = 0;
  protected dataSource = new MatTableDataSource<any>([]);
  protected displayedColumns: string[] = ['cliente', 'fechaReserva', 'acciones'];

  ngOnInit() {
    this.buscarReservaStore.$resultados();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    this.buscarReservaStore.clear();
    this.dataSource.data = [];
  }

  buscar() {
    if (this.selectedTabIndex === 0) {
      const value = this.buscarReservaForm.value();
      const filtro = {
        cedula: value.cedula || '',
        nombres: value.nombres || ''
      };
      this.reservaService.buscarPorCliente(filtro).subscribe(resultados => {
        this.buscarReservaStore.setResultados(resultados);
        this.dataSource.data = resultados;
      });
    } else {
      const value = this.buscarReservaForm.value();
      if (!value.fecha1 || !value.fecha2) return;
      const fecha1 = this.formatDate(value.fecha1);
      const fecha2 = this.formatDate(value.fecha2);
      this.reservaService.buscarPorFechas(fecha1, fecha2).subscribe(resultados => {
        this.buscarReservaStore.setResultados(resultados);
        this.dataSource.data = resultados;
      });
    }
  }

  private formatDate(date: Date | string): string {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00`;
    }
    return date;
  }

  verDetalles(reserva: any) {
    this.dialog.open(BuscarReservaDialogComponent, {
      width: '600px',
      data: reserva
    });
  }
}
