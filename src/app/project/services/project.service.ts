import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Project } from '../models/project'
import { ApiService } from '../../api.service';
import Link from 'ngx-editor/lib/commands/Link';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  project: any = signal([]);

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.apiService.setEnvironment()
  }

  getProjectById(id: number): Observable<Object> {
    console.log(id)
    return this.http.get<Project>(this.apiService.server() + '/api/Project/' + id, this.apiService.httpOptions)
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
    return this.http.get<Array<any>>(this.apiService.server() + '/api/Project', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  getLinksByProjectId(id: number): Observable<Array<Link>> {
    return this.http.get<Array<Link>>(this.apiService.server() + '/api/Project/' + id + '/Links', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  postProject(project: any): Observable<Object> {
    return this.http.post<Project>(this.apiService.server() + '/api/Project', project, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
            this.router.navigateByUrl('/project/' + project.id);
          }
        }),
      );
  }

  putProject(project: any): Observable<Object> {
    return this.http.put<Project>(this.apiService.server() + '/api/Project/' + project.id, project, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
            this.router.navigateByUrl('/project/' + project.id);
          }
        }),
      );
  }

  deleteProject(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server() + '/api/Project/' + id, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }
}
