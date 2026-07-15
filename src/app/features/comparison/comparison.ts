import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ComparisonService } from './comparison.service';
import { Product } from '../../core/models/product.model';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';

interface CompareRow {
    label: string;
    values: string[];
}

@Component({
    selector: 'app-comparison',
    imports: [RouterLink, Button, EmptyState],
    templateUrl: './comparison.html'
})

export class Comparison {
    protected readonly comparison = inject(ComparisonService);
    protected readonly products = this.comparison.selected;
    protected readonly count = this.comparison.count;
    protected readonly canCompare = this.comparison.canCompare;
    protected readonly minCompare = this.comparison.minCompare;

    protected readonly rows = computed<CompareRow[]>(() => {
        const items = this.products();
        if (items.length < this.minCompare) return [];
        return [
            {
                label: 'Fiyat',
                values: items.map((p) => this.formatPrice(this.discounted(p))),
            },
            {
                label: 'Liste fiyatı',
                values: items.map((p) => this.formatPrice(p.price)),
            },
            {
                label: 'İndirim',
                values: items.map((p) => `%${Math.round(p.discountPercentage)}`),
            },
            {
                label: 'Puan',
                values: items.map((p) => `${p.rating.toFixed(1)} / 5`),
            },
            {
                label: 'Stok',
                values: items.map((p) => `${p.stock} adet`),
            },
            {
                label: 'Kategori',
                values: items.map((p) => p.category),
            },
            {
                label: 'Marka',
                values: items.map((p) => p.brand ?? '-'),
            }
        ];
    });

    remove(productId: number): void {
        this.comparison.remove(productId);
    }

    clearAll(): void {
        this.comparison.clear();
    }

    private discounted(p: Product): number {
        return p.price * (1 - p.discountPercentage / 100);
    }

    private formatPrice(value: number): string {
        return `$${value.toFixed(2)}`;
    }

    private minIndex(nums: number[]): number {
        return nums.indexOf(Math.min(...nums));
    }

    private maxIndex(nums: number[]): number {
        return nums.indexOf(Math.max(...nums));
    }

}