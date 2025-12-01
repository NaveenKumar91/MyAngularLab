import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  onLogin() {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;

    if (this.auth.login(username!, password!)) {
      this.router.navigate(['/']);
    } else {
      alert('Invalid credentials');
      this.loginForm.reset();
    }
  }
}
