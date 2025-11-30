import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  protected title = 'MyAngularLab';
  auth = inject(AuthService);
  router = inject(Router)
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);   // ⬅ Redirect after logout
  }
}
