import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class ErrorLoggingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[HTTP ERROR]', {
          url: request.url,
          method: request.method,
          status: error.status,
          message: error.message,
          error: error.error
        });

        return throwError(() => error);
      })
    );
  }
}
