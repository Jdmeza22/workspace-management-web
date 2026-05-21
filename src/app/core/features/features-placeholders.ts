import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Sign Up</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Signup feature - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {}

@Component({
  selector: 'app-workspace-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Select Workspace</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Workspace selector - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceSelectorComponent {}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Dashboard</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Dashboard - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Projects</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Projects list - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent {}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Project Detail</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Project detail - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {}

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Tasks</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Tasks list - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Task Detail</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Task detail - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent {}

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Kanban Boards</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Boards - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent {}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: ` <div class="container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>Settings</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Settings - Coming soon</p>
      </mat-card-content>
    </mat-card>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
