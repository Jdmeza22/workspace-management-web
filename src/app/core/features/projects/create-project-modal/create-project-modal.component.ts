import {Component,ChangeDetectionStrategy,inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule,FormBuilder,Validators} from '@angular/forms';
import {MatDialogModule,MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {signal} from '@angular/core';

export interface CreateProjectRequest {
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-create-project-modal',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateProjectModalComponent>);

  readonly isLoading = signal(false);
  readonly form = this.fb.nonNullable.group({
      name: ['',[Validators.required, Validators.maxLength(100) ]],
      description: ['',  [  Validators.maxLength(250)]],
      status: ['Pending',  Validators.required]
    });

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const payload: CreateProjectRequest = {
      name:this.form.getRawValue().name,
      description:this.form.getRawValue().description,
      status: this.form.getRawValue().status
    };
    this.dialogRef.close(payload);
  }
}
