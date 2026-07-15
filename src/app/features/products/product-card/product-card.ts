import { Component, computed, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-card',
    imports: [Button, Tag, CurrencyPipe],
    templateUrl: './product-card.html'
})

export class ProductCard {
    readonly product = input.required<Product>();
    readonly inComparison = input(false);
    readonly comparisonFull = input(false);
    readonly compareToggle = output<Product>();

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