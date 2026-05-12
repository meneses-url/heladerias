import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from './data-access/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly isSubmittingSignal = signal(false);
  private readonly submitErrorSignal = signal<string | null>(null);

  readonly isSubmitting = this.isSubmittingSignal.asReadonly();
  readonly submitError = this.submitErrorSignal.asReadonly();
  readonly isBusy = computed(
    () => this.isSubmitting() || this.authService.status() === 'authenticating'
  );

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.isBusy()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitErrorSignal.set(null);
    this.isSubmittingSignal.set(true);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => this.isSubmittingSignal.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/dashboard');
        },
        error: (error: unknown) => {
          this.submitErrorSignal.set(this.resolveErrorMessage(error));
        }
      });
  }

  hasError(controlName: 'email' | 'password', errorCode: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.touched && control.hasError(errorCode);
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || 'No fue posible iniciar sesion';
    }

    return 'Ocurrio un error inesperado. Intenta de nuevo.';
  }
}
