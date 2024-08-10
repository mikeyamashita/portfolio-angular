import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { getState } from '@ngrx/signals';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectService } from './services/project.service';
import { ProjectStore } from './store/project.store';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { AuthService } from '../auth/services/auth.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'my-project',
  standalone: true,
  imports: [MatButtonModule, MatIconModule,
    MatCardModule, MatDialogModule,
    RouterModule, MatChipsModule,
    MatProgressSpinnerModule,
    ProjectFormComponent],
  // providers: [ProjectStore],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {

  readonly store = inject(ProjectStore);
  readonly dialog = inject(MatDialog);

  projectId: number = 0;
  project: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    public projectService: ProjectService,
    public authService: AuthService) {
    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.
      const state = getState(this.store);
      // console.log('projects component state changed', state);

      // if (this.store.projects().length) {
      //   console.log(this.store.projects())
      //   console.log(this.store.isLoading())
      // }
    })
  }

  // Lifecycle
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = Number(params["id"])
      this.store.setProjectId(this.projectId)
      this.projectService.getProjectById(this.projectId)
    })
  }

  // Methods
  // findProjectById(id: number) {
  //   this.project = this.store.projects().find(project => {
  //     return Number(project.id) === id
  //   });
  //   console.log(this.project)
  // }

  // Events  
  updateProject() {
    const dialogRef = this.dialog.open(ProjectFormComponent, { data: this.project, width: '90%' });

    dialogRef.afterClosed().subscribe(project => {
      if (project)
        this.store.saveProject(project)
    });
  }

  deleteProject() {
    this.store.deleteProject(this.projectId)
    this.router.navigateByUrl('/grid/asc');
  }

}
