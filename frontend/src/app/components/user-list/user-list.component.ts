import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  showForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService
      .getAllUsers()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: () => {
          this.errorMessage =
            'Failed to load users. Is the backend running on http://localhost:8080?';
        },
      });
  }

  openCreateForm(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  openEditForm(user: User): void {
    this.selectedUser = { ...user };
    this.showForm = true;
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: () => (this.errorMessage = 'Failed to delete user.'),
      });
    }
  }

  onFormSaved(): void {
    this.showForm = false;
    this.loadUsers();
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.selectedUser = null;
  }
}
