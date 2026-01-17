import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { fadeSlide } from '../../share/animations/animation';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
  animations: [fadeSlide]

})
export class AdminLoginComponent {
private auth = inject(AuthService);
  private router = inject(Router);

  token = '';
  error = '';

  login() {
    this.error = '';
    if (this.auth.login(this.token)) {
      this.router.navigate(['/admin']);
      return;
    }
    this.error = 'Invalid Admin Token';
  }

}
