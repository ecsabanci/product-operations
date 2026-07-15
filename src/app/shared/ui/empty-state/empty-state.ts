import { Component, input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    template: `
      <div class="flex flex-col items-center justify-center text-center py-16 px-4">
        <i class="pi pi-inbox text-4xl text-muted mb-3"></i>
        <p class="text-content font-medium">{{ title() }}</p>
        @if (description()) {
          <p class="text-sm text-muted mt-1">{{ description() }}</p>
        }
      </div>
    `
})

export class EmptyState {
    readonly title = input.required<string>();
    readonly description = input<string>();
}
