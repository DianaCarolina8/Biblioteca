import { Component, effect, inject, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { ClienteStore } from '../../store/cliente.store';
import { Cliente } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterOutlet,
    MatSnackBarModule
  ],
  selector: 'app-cliente',
  styleUrl: './cliente.component.css',
  templateUrl: './cliente.component.html',
  providers: [ClienteStore]
})
export class ClienteComponent {

  private readonly clienteStore = inject(ClienteStore);
  private readonly notificationService = inject(NotificationService);
  private readonly clienteService = inject(ClienteService);

  protected readonly dataSource = new MatTableDataSource<Cliente>();
  protected $clientes = this.clienteStore.$clientes;
  protected displayedColumns: string[] = ['idCliente', 'nombres', 'apellidos', 'cedula', 'email', 'actions'];
  protected readonly $sort = viewChild(MatSort);
  protected readonly $paginator = viewChild(MatPaginator);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$clientes();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });
  }

  private setupNotificationEffect() {
    effect(() => {
      const message = this.notificationService.$message();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 3000, horizontalPosition: 'left', verticalPosition: 'top' });
        this.notificationService.clear();
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(idCliente: number) {
    this.clienteService.delete(idCliente).pipe(
      tap(() => {
        this.clienteStore.reload();
        this.notificationService.notify('DELETED');
      })
    ).subscribe();
  }
}
