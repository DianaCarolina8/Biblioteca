import { Routes } from '@angular/router';
import { CategoriaComponent } from './pages/categoria/categoria.component';;
import { CategoriaEditComponent } from './pages/categoria/categoria-edit/categoria-edit.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ClienteEditComponent } from './pages/cliente/cliente-edit/cliente-edit.component';
import { LibroComponent } from './pages/libro/libro.component';
import { LibroDialogComponent } from './pages/libro/libro-dialog/libro-dialog.component';
import { ReservaWizardComponent } from './pages/reserva-wizard/reserva-wizard.component';
import { BuscarReservaComponent } from './pages/buscar-reserva/buscar-reserva.component';


export const routes: Routes = [
    { path: 'pages/categoria', component: CategoriaComponent, children: [
        {path: 'new', component: CategoriaEditComponent},
        {path: 'edit/:id', component: CategoriaEditComponent}
    ] },
    { path: 'pages/cliente', component: ClienteComponent, children: [
        {path: 'new', component: ClienteEditComponent},
        {path: 'edit/:id', component: ClienteEditComponent}
    ] },
    { path: 'pages/libro', component: LibroComponent, children: [
        {path: 'new', component: LibroDialogComponent},
        {path: 'edit/:id', component: LibroDialogComponent}
    ] },
    { path: 'pages/reserva-wizard', component: ReservaWizardComponent },
    { path: 'pages/buscar-reserva', component: BuscarReservaComponent },
    { path: 'busqueda', component: BuscarReservaComponent },

];
