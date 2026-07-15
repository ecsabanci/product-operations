import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LoginResponse, User } from '../models/user.model';
import { resolveRole } from '../models/role.model';

const TOKEN_KEY = 'pop_token';
const USER_KEY = 'pop_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly api = inject(ApiService);
    private readonly router = inject(Router);
    private readonly _user = signal<User | null>(null);
    private readonly _token = signal<string | null>(null);

    readonly user = this._user.asReadonly();
    readonly token = this._token.asReadonly();

    readonly isLoggedIn = computed(() => this._user() !== null);
    readonly role = computed(() => this._user()?.role ?? null);

    constructor() {
        this.hydrate();
    }

    async login(username: string, password: string): Promise<void> {

        const res = await firstValueFrom(
            this.api.post<LoginResponse>('/auth/login', { username, password })
        );

        const user: User = {
            id: res.id,
            username: res.username,
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            image: res.image,
            gender: res.gender,
            role: resolveRole(res.username)
        };

        this._user.set(user);
        this._token.set(res.accessToken);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    logout(): void {
        this._user.set(null);
        this._token.set(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.router.navigateByUrl('/login');
    }

    private hydrate(): void {
        const token = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);
        if (!token || !rawUser) return;

        try {
            const user = JSON.parse(rawUser) as User;
            this._token.set(token);
            this._user.set(user);
        } catch {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }
}