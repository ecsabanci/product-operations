import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Slider } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { LowStockService } from './low-stock.service';
import { ProductCard } from '../products/product-card/product-card';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../shared/ui/error-state/error-state';

const PAGE_STEP = 24;

@Component({
    selector: 'app-low-stock',
    imports: [
        Slider,
        FormsModule,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
        Button,
        Skeleton,
        ProductCard,
        EmptyState,
        ErrorState
    ],
    templateUrl: './low-stock.html'
})

export class LowStock implements OnInit {
    protected readonly service = inject(LowStockService);
    protected readonly thresholdModel = signal(this.service.threshold());
    protected readonly visibleOut = signal(PAGE_STEP);
    protected readonly visibleLow = signal(PAGE_STEP);
    protected readonly visibleIn = signal(PAGE_STEP);

    protected readonly skeletons = Array.from({ length: 8 });

    ngOnInit(): void {
        this.service.load();
    }

    onThresholdChange(value: number): void {
        this.thresholdModel.set(value);
        this.service.setThreshold(value);
        this.visibleOut.set(PAGE_STEP);
        this.visibleLow.set(PAGE_STEP);
        this.visibleIn.set(PAGE_STEP);
    }

    showMoreOut(): void {
        this.visibleOut.update((n) => n + PAGE_STEP);
    }
    showMoreLow(): void {
        this.visibleLow.update((n) => n + PAGE_STEP);
    }
    showMoreIn(): void {
        this.visibleIn.update((n) => n + PAGE_STEP);
    }
}