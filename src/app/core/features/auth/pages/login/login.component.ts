import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../services/auth.service';
import { AuthStore } from '../../../../store/auth.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkspaceSelectorModalComponent } from '../../../projects/workspace-selector-modal/workspace-selector-modal.component';

/**
 * Login Component
 * Standalone, reactive form-based login page
 * Enterprise-grade with proper error handling and loading states
 */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  loginForm!: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (!this.loginForm.valid) { return; }
    this.isLoading.set(true);
    this.error.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        const user = {
          userId: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          workspaces: response.data.workspaces
        };
        this.authService.setUser(user);
        this.authStore.setUser(user);
        this.authStore.setWorkspaces(user.workspaces);
        this.isLoading.set(false);

        this.dialog.open(WorkspaceSelectorModalComponent, {
          data: { workspaces: user.workspaces },
          disableClose: true,
          width: '480px' }).afterClosed().subscribe((selectedWorkspace) => {
            if (selectedWorkspace) {
              this.router.navigate(['/workspace', selectedWorkspace.workspaceId, 'projects']);
            }
          });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || 'Invalid credentials');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
