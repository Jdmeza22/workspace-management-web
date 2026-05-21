import {ChangeDetectionStrategy,Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

/**
 * Root Application Component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
