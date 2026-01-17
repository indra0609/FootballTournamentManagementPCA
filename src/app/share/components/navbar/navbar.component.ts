// import { Component, computed, inject } from '@angular/core';
// import { AuthService } from '../../../core/services/auth.service';
// import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterLink, RouterLinkActive],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {
// private auth = inject(AuthService);
//   isAdmin = computed(() => this.auth.isAdmin());

//   logout() {
//     this.auth.logout();
//   }

//   closeMenu() {
//     const nav = document.getElementById('mainNav');
//     if (!nav) return;

//     // ✅ Get existing collapse instance
//     const bsCollapse = Collapse.getInstance(nav);
//     if (bsCollapse) {
//       bsCollapse.hide();
//     }
//   }
// }

import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare var bootstrap: any; // ✅ no types required

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private auth = inject(AuthService);
  isAdmin = computed(() => this.auth.isAdmin());

  logout() {
    this.auth.logout();
  }

  closeMenu() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(nav);
    bsCollapse.hide();
  }
}
