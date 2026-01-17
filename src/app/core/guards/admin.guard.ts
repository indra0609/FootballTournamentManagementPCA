import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
   const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAdmin()
    ? true
    : router.createUrlTree(['/admin-login'], {
        queryParams: { returnUrl: state.url }
      });
};



// export const adminGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   if (auth.isAdmin()) return true;
//   router.navigate(['/admin-login']);
//   return false;
// };