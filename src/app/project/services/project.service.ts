import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Project } from '../models/project'
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  project: any = signal([]);

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.apiService.setEnvironment()
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getProjectById(id: number): Observable<Object> {
    return this.http.get<Project>(this.apiService.server() + '/api/Project/' + id, this.httpOptions)
      .pipe(
        tapResponse({
          next: (project: any) => {
            this.project.set(project)
          },
          error: catchError(this.apiService.handleError)
        })
      )
  }

  getProjects(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.apiService.server() + '/api/Project', this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  postProject(project: any): Observable<Object> {
    return this.http.post<Project>(this.apiService.server() + '/api/Project', project, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  putProject(project: any): Observable<Object> {
    return this.http.put<Project>(this.apiService.server() + '/api/Project/' + project.id, project, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  deleteProject(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server() + '/api/Project/' + id, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }
}
