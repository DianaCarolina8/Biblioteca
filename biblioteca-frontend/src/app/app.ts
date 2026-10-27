import { Component, signal } from '@angular/core';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { LayoutComponent } from './pages/layout/layout.component';

@Component({
  imports: [LayoutComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('biblioteca-frontend');
}
