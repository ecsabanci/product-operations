import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ProductsApi } from '../products/products.api';
import { Product, LOW_STOCK_THRESHOLD } from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class LowStockService {
    private readonly api = inject(ProductsApi);
    private readonly _all = signal<Product[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal(false);
    private readonly _threshold = signal(LOW_STOCK_THRESHOLD);

    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly threshold = this._threshold.asReadonly();
    readonly loaded = computed(() => this._all().length > 0);

    readonly outOfStock = computed(() =>
        this._all().filter((p) => p.stock === 0)
    );

    readonly lowStock = computed(() =>
        this._all().filter((p) => p.stock > 0 && p.stock <= this._threshold())
    );

    readonly inStock = computed(() =>
        this._all().filter((p) => p.stock > this._threshold())
    );

    setThreshold(value: number): void {
        this._threshold.set(value);
    }

    load(): void {
        if (this.loaded()) return;

        this._loading.set(true);
        this._error.set(false);

        this.api.list(0, 0).pipe(
            tap((res) => this._all.set(res.products)),
            catchError(() => {
                this._error.set(true);
                return of(null);
            })
        ).subscribe(() => this._loading.set(false));
    }

    retry(): void {
        this._all.set([]); // reset so load() fetches again
        this.load();
    }
}