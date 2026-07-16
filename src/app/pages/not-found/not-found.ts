import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Button],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-4">
      <span class="text-6xl font-bold text-primary">404</span>
      <div>
        <h1 class="text-2xl font-semibold text-content">Sayfa bulunamadı</h1>
        <p class="text-sm text-muted mt-1 max-w-md">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>
      <p-button label="Ana sayfaya dön" icon="pi pi-home" routerLink="/products" />
    </div>
  `
})
export class NotFound {}