import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, Button, Tag],
    templateUrl: './layout.html'
})

export class Layout {
    private readonly auth = inject(AuthService);

    readonly user = this.auth.user;
    readonly role = this.auth.role;

    logout(): void {
        this.auth.logout();
    }
}