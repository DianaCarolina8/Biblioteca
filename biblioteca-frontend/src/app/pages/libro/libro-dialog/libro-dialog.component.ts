import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Libro } from '../../../model/libro';
import { LibroForm } from '../../../forms/libro.form';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LibroDialogStore } from '../../../store/libro-dialog.store';
import {MatSelectModule} from '@angular/material/select';
import { LibroService } from '../../../services/libro.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  imports: [
    MatDialogModule,
    MatToolbarModule,
    FormRoot,
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  selector: 'app-libro-dialog',
  styleUrl: './libro-dialog.component.css',
  templateUrl: './libro-dialog.component.html',
  providers: [LibroForm, LibroDialogStore]
})
export class LibroDialogComponent {
  private readonly data = inject<Libro>(MAT_DIALOG_DATA);
  protected readonly libroForm = inject(LibroForm);
  private readonly dialogRef = inject(MatDialogRef<LibroDialogComponent>);
  private readonly libroDialogStore = inject(LibroDialogStore);
  private readonly libroService = inject(LibroService);
  private readonly notificationService = inject(NotificationService);

  protected $categorias = this.libroDialogStore.$categorias;

  constructor() {
    this.libroForm.patch(this.data);
    
  }


  operate(){
    if(this.libroForm.isInvalid()) return;

    const isEdit = this.libroForm.isEdit();
    const libro: Libro = this.libroForm.value();
    const file = null;

    //no file: photo keeps the stored URL and the backend maps it back onto the entity
    const operation$ = isEdit
      ? this.libroService.update(libro.idLibro, libro)
      : this.libroService.save(libro);

    operation$.subscribe( ()=> {
      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
      this.dialogRef.close(true);
    });
  }

  close(){
    this.dialogRef.close();
  }
}
