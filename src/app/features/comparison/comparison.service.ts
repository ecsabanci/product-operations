import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from '../../core/models/product.model';

const MAX_COMPARE = 3;
const MIN_COMPARE = 2;
const STORAGE_KEY = 'pop_comparison';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
    private readonly messageService = inject(MessageService);

    private readonly _selected = signal<Product[]>(this.hydrate());
    readonly selected = this._selected.asReadonly();

    constructor() {
        // side effect outside the signal graph to keep the selection across refreshes
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._selected()));
        });
    }

    private hydrate(): Product[] {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as Product[];
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
    }

    readonly count = computed(() => this._selected().length);
    readonly isFull = computed(() => this._selected().length >= MAX_COMPARE);
    readonly canCompare = computed(() => this._selected().length >= MIN_COMPARE);

    readonly maxCompare = MAX_COMPARE;
    readonly minCompare = MIN_COMPARE;

    isSelected(productId: number): boolean {
        return this._selected().some((p) => p.id === productId);
    }

    toggle(product: Product): void {
        if (this.isSelected(product.id)) {
            this.remove(product.id);
            return;
        }
        this.add(product);
    }

    private add(product: Product): void {
        if (this.isFull()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Karşılaştırma dolu',
                detail: `En fazla ${MAX_COMPARE} ürün karşılaştırabilirsiniz.`
            });
            return;
        }

        if (this.isSelected(product.id)) return;

        this._selected.update((list) => [...list, product]); // new array reference so the signal notifies consumers
    }

    remove(productId: number): void {
        this._selected.update((list) => list.filter((p) => p.id !== productId));
    }

    clear(): void {
        this._selected.set([]);
    }
}
