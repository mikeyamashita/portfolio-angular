import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../../api.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = signal({});
  token = signal(localStorage.getItem('token'));

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.apiService.setEnvironment()
  }

  login<AuthResponse>(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiService.server() + '/login', user, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

}
