import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Project } from '../models/project'
import { Router } from '@angular/router';
import { ApiService } from '../../_helpers/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects: Array<any> = new Array<any>();
  project: any = signal([]);

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getProjectById(id: number) {
    if (this.projects.length == 0) {
      this.http.get<Project>(this.apiService.server + '/api/Projects/' + id, this.httpOptions).subscribe({
        next: project => {
          this.project.set(project)
        },
        error: err => {
          this.router.navigateByUrl('/grid/asc');
          console.log(err)
        }
      })
    } else
      this.project.set(this.projects.filter(project => project.id === id)[0])
  }

  getProjects(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.apiService.server + '/api/Projects', this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  postProject(project: any): Observable<Object> {
    return this.http.post<Project>(this.apiService.server + '/api/Projects', project, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  putProject(project: any): Observable<Object> {
    return this.http.put<Project>(this.apiService.server + '/api/Projects/' + project.id, project, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  deleteProject(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server + '/api/Projects/' + id, this.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }
}
