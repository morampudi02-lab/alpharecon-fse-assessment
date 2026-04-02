import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

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

  formModel: Partial<User> = {};
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.syncForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.syncForm();
    }
  }

  private syncForm(): void {
    this.errorMessage = '';
    this.formModel = this.user
      ? { ...this.user }
      : { firstName: '', lastName: '', email: '', note: '' };
  }

  submit(): void {
    const payload = this.formModel as User;
    if (this.user?.id != null) {
      this.userService.updateUser(this.user.id, payload).subscribe({
        next: () => this.saved.emit(),
        error: () => (this.errorMessage = 'Failed to update user.'),
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => this.saved.emit(),
        error: () => (this.errorMessage = 'Failed to create user.'),
      });
    }
  }

  cancel(): void {
    this.errorMessage = '';
    this.cancelled.emit();
  }
}
