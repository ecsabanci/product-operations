import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink, Button],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-4">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <i class="pi pi-lock text-3xl text-red-500"></i>
      </div>
      <div>
        <h1 class="text-2xl font-semibold text-content">Erişim yetkiniz yok</h1>
        <p class="text-sm text-muted mt-1 max-w-md">
          Bu sayfayı görüntüleme izniniz bulunmuyor. Rolünüz bu alana erişime
          uygun değil.
        </p>
      </div>
      <p-button label="Ürünlere dön" icon="pi pi-arrow-left" routerLink="/products" />
    </div>
  `
})
export class Unauthorized {}