import { Component, computed, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { Product,  LOW_STOCK_THRESHOLD} from '../../../core/models/product.model';

@Component({
    selector: 'app-product-card',
    imports: [Button, DecimalPipe, CurrencyPipe],
    templateUrl: './product-card.html'
})

export class ProductCard {
    protected readonly lowStockThreshold = LOW_STOCK_THRESHOLD;
    readonly product = input.required<Product>();
    readonly inComparison = input(false);
    readonly comparisonFull = input(false);
    readonly compareToggle = output<Product>();
    readonly showCompare = input(true);

    readonly discountedPrice = computed(() => {
        const p = this.product();
        return p.price * (1 - p.discountPercentage / 100);
    });

    readonly compareDisabled = computed(
        () => this.comparisonFull() && !this.inComparison()
    );

    onCompareClick(): void {
        this.compareToggle.emit(this.product());
    }
}