import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  constructor() {}

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else if (error.status === 0) {
      // Unknown error
      errorMessage = `An unknown error occurred. Status: ${error.status}`;
    } else {
      // Backend error
      const serverMessage = error.error?.message || error.message;
      switch (error.status) {
        case 404:
          errorMessage = `Not Found: The requested resource was not found. URL: ${error.url}`;
          break;
        case 500:
          errorMessage = `Internal Server Error: A server-side error occurred. URL: ${error.url}`;
          break;
        default:
          errorMessage = `A server-side error occurred. Error Code: ${error.status}\nMessage: ${serverMessage}\nURL: ${error.url}`;
          break;
      }
    }
    console.error('Error Details:', {
      message: errorMessage,
      status: error.status,
      url: error.url,
      error: error.error,
    });
    return throwError(() => new Error(errorMessage));
  }
}
