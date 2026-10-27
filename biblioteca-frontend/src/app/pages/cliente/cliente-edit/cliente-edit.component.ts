import { Component, computed, effect, inject } from '@angular/core';
import { FormRoot, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClienteStore } from '../../../store/cliente.store';
import { ClienteEditStore } from '../../../store/cliente-edit.store';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ClienteForm } from '../../../forms/cliente.form';

@Component({
  imports: [
    FormRoot,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormField,
    RouterLink
  ],
  selector: 'app-cliente-edit',
  styleUrl: './cliente-edit.component.css',
  templateUrl: './cliente-edit.component.html',
  providers: [ClienteForm, ClienteEditStore]
})
export class ClienteEditComponent {

  protected readonly clienteForm = inject(ClienteForm);
  private readonly route = inject(ActivatedRoute);
  private readonly clienteEditStore = inject(ClienteEditStore);
  private readonly clienteService = inject(ClienteService);
  private readonly clienteStore = inject(ClienteStore);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  private readonly $params = toSignal(this.route.params, { initialValue: {} });

  protected $id = computed(() => {
    const id = this.$params()['id'];
    return id ? Number(id) : null;
  });

  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.clienteEditStore.setId(this.$id());
    });

    effect(() => {
      if (this.clienteEditStore.clienteResource.hasValue()) {
        this.clienteForm.patch(this.clienteEditStore.clienteResource.value());
      }
    });
  }

  operate() {
    if (this.clienteForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const cliente: Cliente = this.clienteForm.value();

    const operation$ = isEdit ? this.clienteService.update(id, cliente) : this.clienteService.save(cliente);

    operation$.subscribe(() => {
      this.clienteStore.reload();
      this.notificationService.notify(isEdit ? 'UPDATED' : 'CREATED');
      this.router.navigate(['/pages/cliente']);
    });
  }
}
