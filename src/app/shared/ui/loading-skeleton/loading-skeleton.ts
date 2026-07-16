import { Component, computed, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-loading-skeleton',
    imports: [Skeleton],
    template: `
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        @for (item of items(); track $index) {
          <div class="border border-surface-200 rounded-xl overflow-hidden">
            <p-skeleton height="12rem" styleClass="!rounded-none" />
            <div class="p-3 flex flex-col gap-2">
              <p-skeleton height="1rem" width="80%" />
              <p-skeleton height="1rem" width="40%" />
              <p-skeleton height="1.5rem" width="60%" />
            </div>
          </div>
        }
      </div>
    `
})

export class LoadingSkeleton {
    readonly count = input(8);
    protected readonly items = computed(() => Array.from({ length: this.count() }));
}
