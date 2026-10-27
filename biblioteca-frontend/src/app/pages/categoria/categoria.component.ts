
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CategoriaStore } from '../../store/categoria.store';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Categoria } from '../../model/categoria';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { CategoriaService } from '../../services/categoria.service';
import { tap } from 'rxjs';

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
  selector: 'app-categoria',
  styleUrl: './categoria.component.css',
  templateUrl: './categoria.component.html',
  providers: [CategoriaStore]
})
export class CategoriaComponent {

  private readonly categoriaStore = inject(CategoriaStore);
  private readonly notificationService = inject(NotificationService);
  private readonly categoriaService = inject(CategoriaService);
  
  protected readonly dataSource = new MatTableDataSource<Categoria>();
  protected $categorias = this.categoriaStore.$categorias;
  protected displayedColumns: string[] = ['idCategoria', 'nombre', 'descripcion', 'estado', 'actions'];
  protected readonly $sort = viewChild(MatSort);
  protected readonly $paginator = viewChild(MatPaginator);
  private readonly snackBar = inject(MatSnackBar);


  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }
  
  private setupTableEffect() {
    effect(() => {
      const data = this.$categorias();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;      
    });
  }

  private setupNotificationEffect(){
    effect(() => {
      const message = this.notificationService.$message();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 3000, horizontalPosition: 'left', verticalPosition: 'top' });        
        this.notificationService.clear();
      }
    });
  }

  
  applyFilter(e: any){
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  

  delete(idCategoria: number){
    this.categoriaService.delete(idCategoria).pipe(
      tap(() => {
        this.categoriaStore.reload();
        this.notificationService.notify('DELETED');
      })
    ).subscribe();
  }
}