import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service';
import {
    Category,
    ProductListResponse
} from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
    private readonly api = inject(ApiService);

    list(limit: number, skip: number): Observable<ProductListResponse> {
        return this.api.get<ProductListResponse>('/products', { limit, skip });
    }

    search(query: string, limit: number, skip: number): Observable<ProductListResponse> {
        return this.api.get<ProductListResponse>('/products/search', {
            q: query,
            limit,
            skip
        });
    }

    byCategory(slug: string, limit: number, skip: number): Observable<ProductListResponse> {
        return this.api.get<ProductListResponse>(`/products/category/${slug}`, {
            limit,
            skip
        });
    }

    categories(): Observable<Category[]> {
        return this.api.get<Category[]>('/products/categories');
    }
}