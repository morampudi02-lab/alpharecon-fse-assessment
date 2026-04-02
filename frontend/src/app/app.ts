import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
