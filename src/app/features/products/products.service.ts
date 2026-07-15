import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ProductsApi } from './products.api';
import { Category, Product } from '../../core/models/product.model';

type FilterMode =
    | { kind: 'all' }
    | { kind: 'search'; query: string }
    | { kind: 'category'; slug: string };

const PAGE_SIZE = 20;

@Injectable({ providedIn: 'root' })
export class ProductsService {
    private readonly api = inject(ProductsApi);

    private readonly _products = signal<Product[]>([]);
    private readonly _total = signal(0);
    private readonly _page = signal(0);
    private readonly _filter = signal<FilterMode>({ kind: 'all' });
    private readonly _loading = signal(false);
    private readonly _error = signal(false);
    private readonly _categories = signal<Category[]>([]);

    readonly products = this._products.asReadonly();
    readonly total = this._total.asReadonly();
    readonly page = this._page.asReadonly();
    readonly filter = this._filter.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly categories = this._categories.asReadonly();

    readonly pageSize = PAGE_SIZE;
    readonly totalPages = computed(() => Math.ceil(this._total() / PAGE_SIZE));
    readonly isEmpty = computed(
        () => !this._loading() && !this._error() && this._products().length === 0
    );

    loadCategories(): void {
        if (this._categories().length > 0) return;

        this.api.categories().pipe(
            catchError(() => of([] as Category[]))
        ).subscribe((cats) => this._categories.set(cats));
    }

    loadProducts(): void {
        this._filter.set({ kind: 'all' });
        this._page.set(0);
        this.fetch();
    }

    search(query: string): void {
        const trimmed = query.trim();
        if (trimmed === '') {
            this.loadProducts();
            return;
        }
        this._filter.set({ kind: 'search', query: trimmed });
        this._page.set(0);
        this.fetch();
    }

    selectCategory(slug: string | null): void {
        if (slug === null) {
            this.loadProducts();
            return;
        }
        this._filter.set({ kind: 'category', slug });
        this._page.set(0);
        this.fetch();
    }

    goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages()) return;
        this._page.set(page);
        this.fetch();
    }

    private fetch(): void {
        this._loading.set(true);
        this._error.set(false);

        const skip = this._page() * PAGE_SIZE;
        const filter = this._filter();

        const request$ =
            filter.kind === 'search'
                ? this.api.search(filter.query, PAGE_SIZE, skip)
                : filter.kind === 'category'
                    ? this.api.byCategory(filter.slug, PAGE_SIZE, skip)
                    : this.api.list(PAGE_SIZE, skip);

        request$
            .pipe(
                tap((res) => {
                    this._products.set(res.products);
                    this._total.set(res.total);
                }),
                catchError(() => {
                    this._error.set(true);
                    this._products.set([]);
                    this._total.set(0);
                    return of(null);
                })
            )
            .subscribe(() => {
                this._loading.set(false);
            });
    }

    retry(): void {
        this.fetch();
    }
}