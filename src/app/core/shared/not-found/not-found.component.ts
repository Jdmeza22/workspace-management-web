import { ChangeDetectionStrategy,Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  templateUrl:'./not-found.component.html',
  styleUrl:'./not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
private readonly route = inject(ActivatedRoute);
private readonly router = inject(Router);

  goToProjects(): void {
    this.router.navigate(['projects'], { relativeTo: this.route });
  }
}
