import { TestBed } from '@angular/core/testing';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('HttpErrorHandlerService', () => {
  let service: HttpErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client-side errors', () => {
    const error = new ErrorEvent('Network error', {
      message: 'A client-side error occurred',
    });
    const response = new HttpErrorResponse({
      error,
      status: 0,
      statusText: 'Unknown error',
    });

    spyOn(console, 'error');
    service.handleError(response).subscribe({
      error: (error) => {
        expect(error.message).toContain('A client-side error occurred');
      },
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error Details:',
      jasmine.objectContaining({
        message: jasmine.stringMatching('A client-side error occurred'),
      })
    );
  });

  it('should handle 404 errors', () => {
    const response = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: 'http://example.com/api/resource',
    });

    spyOn(console, 'error');
    service.handleError(response).subscribe({
      error: (error) => {
        expect(error.message).toContain(
          'Not Found: The requested resource was not found'
        );
        expect(error.message).toContain('URL: http://example.com/api/resource');
      },
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error Details:',
      jasmine.objectContaining({
        message: jasmine.stringMatching(
          'Not Found: The requested resource was not found'
        ),
      })
    );
  });

  it('should handle 500 Internal Server Error', () => {
    const response = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      url: 'http://example.com/api/resource',
    });

    spyOn(console, 'error');
    service.handleError(response).subscribe({
      error: (error) => {
        expect(error.message).toContain(
          'Internal Server Error: A server-side error occurred'
        );
        expect(error.message).toContain('URL: http://example.com/api/resource');
      },
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error Details:',
      jasmine.objectContaining({
        message: jasmine.stringMatching(
          'Internal Server Error: A server-side error occurred'
        ),
      })
    );
  });

  it('should handle unknown errors', () => {
    const response = new HttpErrorResponse({
      error: {},
      status: 0,
      statusText: 'Unknown error',
    });

    spyOn(console, 'error');
    service.handleError(response).subscribe({
      error: (error) => {
        expect(error.message).toContain('An unknown error occurred');
      },
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error Details:',
      jasmine.objectContaining({
        message: jasmine.stringMatching('An unknown error occurred'),
      })
    );
  });
});
