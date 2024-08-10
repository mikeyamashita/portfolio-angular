import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../../_helpers/api.service';
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

  login(user: any): Observable<Object> {

    return this.http.post<User>(this.apiService.server() + '/login', user, this.httpOptions)
      .pipe(
      // catchError(this.apiService.handleError)
    );
  }

}
