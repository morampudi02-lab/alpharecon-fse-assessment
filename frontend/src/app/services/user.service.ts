import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface UserWritePayload {
  firstName: string;
  lastName: string;
  email: string;
  note?: string;
}

function resolveUsersApiUrl(): string {
  if (typeof globalThis === 'undefined' || !('location' in globalThis)) {
    return '/api/v1/users';
  }
  const loc = globalThis.location as Location;
  if (loc.port === '4200') {
    return `${loc.protocol}//127.0.0.1:8080/api/v1/users`;
  }
  return '/api/v1/users';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = resolveUsersApiUrl();

  constructor(private http: HttpClient) {}

  private toWritePayload(user: User): UserWritePayload {
    return {
      firstName: (user.firstName ?? '').trim(),
      lastName: (user.lastName ?? '').trim(),
      email: (user.email ?? '').trim(),
      note: user.note?.trim() || undefined,
    };
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, this.toWritePayload(user));
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, this.toWritePayload(user));
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
