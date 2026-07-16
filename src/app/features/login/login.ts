import { Component, inject, signal } from '@angular/core';
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Card } from 'primeng/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, InputText, Password, Button, Card],
    templateUrl: './login.html'
})

export class Login {
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });
    async onSubmit(): Promise<void> {
        // Skip the API call on an invalid form; mark fields touched and show errors
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        try {
            const { username, password } = this.form.getRawValue();
            await this.auth.login(username, password);
            await this.router.navigateByUrl('/products');
        } catch {
            this.errorMessage.set('Kullanıcı adı veya şifre hatalı.');
        } finally {
            this.loading.set(false);
        }
    }
}