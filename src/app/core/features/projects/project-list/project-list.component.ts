import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../interfaces/project.interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection:
    ChangeDetectionStrategy.OnPush
})

export class ProjectsListComponent implements OnInit {

  private readonly projectService = inject(ProjectService);
  readonly createProjectDialog = inject(MatDialog);
  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal(false);
  readonly canCreateProjects = inject(AuthStore).canCreateProjects;

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.isLoading.set(true);

    this.projectService.getProjects()
      .subscribe({
        next: (projects) => {
          this.projects.set(projects.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.isLoading.set(false);
        }
      });
  }

  createProject(): void {
    this.createProjectDialog.open(CreateProjectModalComponent, {})
      .afterClosed().subscribe((result) => {
        if (result) {
          this.projectService.createProject(result)
            .subscribe({
              next: (project) => {
                this.projects.update((projects) => [...projects, project.data]);
              },
              error: (error) => {
                console.error(error);
              }
            });
        }
      });
  }

}
