import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiBaseUrl;

    get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${path}`, {
            params: this.toHttpParams(params)
        });
    }

    post<T>(path: string, body: unknown): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${path}`, body);
    }

    private toHttpParams(
        params?: Record<string, string | number>
    ): Record<string, string> | undefined {
        if (!params) return undefined;
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(params)) {
            result[key] = String(value);
        }
        return result;
    }
}