import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Workspace } from '../../../interfaces/auth.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-workspace-selector-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './workspace-selector-modal.html',
  styleUrls: ['./workspace-selector-modal.scss'],
})
export class WorkspaceSelectorModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<WorkspaceSelectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workspaces: Workspace[] },
    private readonly authService: AuthService,
    private readonly authStore: AuthStore,
  ) { }

  selectWorkspace(workspace: Workspace) {
    const user = this.authStore.user();
    if (!user) return;

    this.authStore.setCurrentWorkspace(workspace);
    this.authService.generateToken({ userId: user.userId, workspaceId: workspace.workspaceId }).subscribe({
      next: () => {
        this.authStore.setIsAuthenticated(true);
        this.dialogRef.close(workspace);
      },
      error: () => {
      }
    });
  }
}
