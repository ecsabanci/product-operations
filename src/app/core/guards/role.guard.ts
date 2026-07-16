import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.model';

export function roleGuard(requiredRole: Role): CanActivateFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        if (auth.role() === requiredRole) {
            return true;
        }

        return router.createUrlTree(['/unauthorized']);
    };
}