import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private readonly TOKEN_KEY = 'PCA_ADMIN_TOKEN';
  private readonly MASTER_TOKEN = 'PARBATIPUR_ADMIN_2026'; // same as Apps Script

  private _isAdmin = signal(false);
  isAdmin = this._isAdmin.asReadonly();

  constructor() {
    this._isAdmin.set(sessionStorage.getItem(this.TOKEN_KEY) === this.MASTER_TOKEN);
  }

  login(token: string) {
    if (token === this.MASTER_TOKEN) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      this._isAdmin.set(true);
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this._isAdmin.set(false);
  }

  getToken(): string {
    return sessionStorage.getItem(this.TOKEN_KEY) || '';
  }
}
