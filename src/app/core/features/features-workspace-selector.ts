import {Component,inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {AuthStore} from '../../core/store/auth.store';
import {AuthService} from '../../core/services/auth.service';
import {Workspace} from '../../core/interfaces/auth.interface';

@Component({

  selector: 'app-workspace-selector',
  standalone: true,
  imports:[
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="container">
      <mat-card class="workspace-card">
        <mat-card-header>
          <mat-card-title>
            Select Workspace
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (workspace of workspaces(); track workspace.workspaceId) {
            <button mat-raised-button color="primary" class="workspace-button"
              (click)="selectWorkspace(workspace)" >
              {{ workspace.name }}
              ({{ workspace.role }})
            </button>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,

  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .workspace-card {
      width: 400px;
    }

    .workspace-button {
      width: 100%;
      margin-bottom: 1rem;
    }
  `]
})
export class WorkspaceSelectorComponent {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly workspaces = this.authStore.workspaces;
  readonly user = this.authStore.user;

  selectWorkspace(workspace: Workspace): void {
    const user = this.user();
    if (!user) {return;}

    this.authStore.setCurrentWorkspace( workspace);
    this.authService.generateToken({
      userId: user.userId,
      workspaceId: workspace.workspaceId
    }).subscribe({
      next: () => {
        this.authStore.setIsAuthenticated(true);
        this.router.navigate(['/projects' ]);
      }
    });
  }
}
