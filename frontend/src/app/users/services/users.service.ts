import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService
  ) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap((users) => console.log('Fetched users:', users)),
      catchError(this.httpErrorHandler.handleError)
    );
    // return throwError(() => new Error('Simulated network error')).pipe(
    //   tap((users) => console.log('Fetched users:', users)),
    //   catchError(this.handleError)
    // );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap((user) => console.log('Fetched user:', user)),
      catchError(this.httpErrorHandler.handleError)
    );
  }

  updateUser(id: string, user: Omit<User, 'id'>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      tap((updatedUser) => console.log('Updated user:', updatedUser)),
      catchError(this.httpErrorHandler.handleError)
    );
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap((newUser) => console.log('Created user:', newUser)),
      catchError(this.httpErrorHandler.handleError)
    );
  }
}
