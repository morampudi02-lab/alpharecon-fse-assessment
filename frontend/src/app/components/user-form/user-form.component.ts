import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formData: User = {
    firstName: '',
    lastName: '',
    email: '',
    note: '',
  };

  isEditMode = false;
  errorMessage = '';
  isSubmitting = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.syncFromUserInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.syncFromUserInput();
    }
  }

  private syncFromUserInput(): void {
    if (this.user != null && this.user.id != null) {
      this.isEditMode = true;
      this.formData = { ...this.user };
    } else {
      this.isEditMode = false;
      this.formData = { firstName: '', lastName: '', email: '', note: '' };
    }
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.user != null && this.user.id != null) {
      this.userService.updateUser(this.user.id, this.formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (err) => {
          this.errorMessage = this.apiErrorMessage(err, 'Failed to update user.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.userService.createUser(this.formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (err) => {
          this.errorMessage = this.apiErrorMessage(err, 'Failed to create user.');
          this.isSubmitting = false;
        },
      });
    }
  }

  private apiErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse && err.error && typeof err.error === 'object') {
      const msg = (err.error as { message?: string }).message;
      if (typeof msg === 'string' && msg.length > 0) {
        return msg;
      }
    }
    return fallback;
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  cancel(): void {
    this.onCancel();
  }
}
