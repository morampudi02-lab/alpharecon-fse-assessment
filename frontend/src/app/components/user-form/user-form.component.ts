import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
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
    if (this.user) {
      this.isEditMode = true;
      this.formData = { ...this.user };
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.isEditMode && this.user?.id) {
      this.userService.updateUser(this.user.id, this.formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update user.';
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
          this.errorMessage = err.error?.message || 'Failed to create user.';
          this.isSubmitting = false;
        },
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
