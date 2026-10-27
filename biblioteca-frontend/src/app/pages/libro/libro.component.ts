import { Component, effect, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LibroStore } from '../../store/libro.store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';
import { Libro } from '../../model/libro';
import { LibroDialogComponent } from './libro-dialog/libro-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { LibroService } from '../../services/libro.service';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  selector: 'app-libro',
  styleUrl: './libro.component.css',
  templateUrl: './libro.component.html',
  providers: [LibroStore]
})
export class LibroComponent {

  private readonly libroStore = inject(LibroStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);
  private readonly libroService = inject(LibroService);

  protected dataSource = new MatTableDataSource<Libro>();
  protected displayedColumns: string[] = ['idLibro', 'titulo', 'autor', 'isbn', 'disponible', 'actions'];
  protected $libros = this.libroStore.$libros;
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  constructor(){
    this.initializeEffects();
  }

  private initializeEffects() {
    effect(()=> {
      const data = this.$libros();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });

    effect(()=> {
      const message = this.notificationService.$message();
      if(message){
        this.snackBar.open(message, 'INFO', {
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top'
        });
        this.notificationService.clear();
      }
    });
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(libro?: Libro){
    this.dialog.open(LibroDialogComponent, {
      data: libro
    }).afterClosed().subscribe( (saved)=> {
      if(saved){
        this.libroStore.reload();
      }
    });
  }

  delete(idLibro: number){
    this.dialog.open<ConfirmDialogComponent, void, boolean>(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter(confirmed => confirmed === true),
        switchMap(() => this.libroService.delete(idLibro)),
        tap(() => {
          this.libroStore.reload();
          this.notificationService.notify('DELETED');
        })
      ).subscribe();
  }
}