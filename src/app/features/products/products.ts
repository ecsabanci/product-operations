import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { ProductsService } from './products.service';
import { ProductCard } from './product-card/product-card';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';
import { LoadingSkeleton } from '../../shared/ui/loading-skeleton/loading-skeleton';
import { ComparisonService } from '../comparison/comparison.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-products',
    imports: [
        ReactiveFormsModule,
        InputText,
        Select,
        Paginator,
        ProductCard,
        EmptyState,
        ErrorState,
        LoadingSkeleton,
    ],
    templateUrl: './products.html'
})

export class Products implements OnInit {
    protected readonly comparison = inject(ComparisonService);
    protected readonly service = inject(ProductsService);
    private readonly auth = inject(AuthService);
    protected readonly isViewer = computed(() => this.auth.role() === 'viewer');
    protected readonly searchControl = new FormControl('', { nonNullable: true });
    protected readonly categoryControl = new FormControl<string | null>(null);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.service.loadCategories();
        this.service.loadProducts();

        // distinctUntilChanged prevents searching the same term multiple times
        // takeUntilDestroyed cleans the subscription when the component is destroyed
        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((term) => {
                this.categoryControl.setValue(null, { emitEvent: false });
                this.service.search(term);
            });

        this.categoryControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((slug) => {
                this.searchControl.setValue('', { emitEvent: false });
                this.service.selectCategory(slug);
            });
    }


    onPageChange(event: PaginatorState): void {
        this.service.goToPage(event.page ?? 0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onCompareToggle(product: Product): void {
        this.comparison.toggle(product);
    }
}