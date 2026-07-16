import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-error-state',
    imports: [Button],
    template: `
      <div class="flex flex-col items-center justify-center text-center py-16 px-4">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
        <p class="text-content font-medium">{{ title() }}</p>
        <p class="text-sm text-muted mt-1 mb-4">{{ description() }}</p>
        <p-button
          label="Tekrar dene"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          (onClick)="retry.emit()"
        />
      </div>
    `
})


export class ErrorState {
    readonly title = input('Bir şeyler ters gitti');
    readonly description = input('Veri yüklenirken bir hata oluştu.');
    readonly retry = output<void>();
}