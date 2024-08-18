import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { Link } from '../models/link'
import { ApiService } from '../../api.service';
@Injectable({
  providedIn: 'root'
})
export class LinkService {
  linksToRemove: Array<number> = new Array<number>()
  linksToAdd: Array<Link> = new Array<Link>()

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.apiService.setEnvironment()
  }

  getLinkById(id: number): Observable<Link> {
    return this.http.get<Link>(this.apiService.server() + '/api/Link/' + id, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  getLinks(): Observable<Array<Link>> {
    return this.http.get<Array<Link>>(this.apiService.server() + '/api/Link', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  postLink(link: Link): Observable<Link> {
    return this.http.post<Link>(this.apiService.server() + '/api/Link', link, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  putLink(link: Link): Observable<Link> {
    return this.http.put<Link>(this.apiService.server() + '/api/Link/' + link.id, link, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  deleteLink(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server() + '/api/Link/' + id, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

}
