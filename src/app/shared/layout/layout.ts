import { Component, computed, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Menu],
  templateUrl: './layout.html'
})
export class Layout {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;
  readonly role = this.auth.role;

  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    return `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
  });

  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.role() === 'admin' ? 'Admin' : 'Viewer',
      icon: this.role() === 'admin' ? 'pi pi-shield' : 'pi pi-eye',
      disabled: true
    },
    { separator: true },
    {
      label: 'Çıkış',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logout()
    }
  ]);
}