import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly validUser = {
    username: 'admin',
    password: 'admin123'
  };

  login(username: string, password: string): boolean {
    const ok = username === this.validUser.username && password === this.validUser.password;
    this._isLoggedIn.set(ok);

    if (ok) localStorage.setItem('loggedIn', 'true');
    return ok;
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('loggedIn');
  }

  checkSession() {
    if (localStorage.getItem('loggedIn') === 'true') {
      this._isLoggedIn.set(true);
    }
  }
}
