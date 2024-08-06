import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { getState } from '@ngrx/signals';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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
    RouterModule, MatChipsModule, ProjectFormComponent],
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
      console.log('projects component state changed', state);

      if (this.store.projects().length) {
        console.log(this.store.projects())
        // this.findProjectById(this.projectId)
      }
    })
  }

  // Lifecycle
  ngOnInit() {
    console.log('init project')

    this.route.params.subscribe(params => {
      this.projectId = Number(params["id"])
      this.store.setProjectId(this.projectId)

      // console.log(this.store.id())
      this.projectService.getProjectById(this.projectId)
      // console.log(this.store.projects())
      // this.store.id() = this.projectId

      // this.projectService.getProjectById(this.projectId).subscribe(project => {
      //   console.log(this.project)
      //   this.project = project
      // });

      // this.project = this.store.findProjectById(this.projectId)

      // this.store.getProjects();
      // this.findProjectById(this.projectId)
      // console.log(this.project)

    })
  }

  // Methods
  findProjectById(id: number) {
    // console.log(this.store.projects())
    // console.log(id)
    this.project = this.store.projects().find(project => {
      return Number(project.id) === id
    });
    console.log(this.project)
  }

  // Events  
  updateProject() {
    const dialogRef = this.dialog.open(ProjectFormComponent, { data: this.project, width: '90%' });

    dialogRef.afterClosed().subscribe(project => {
      console.log(`Dialog result:`, project);
      if (project)
        this.store.saveProject(project)
    });
  }

  // updateProject() {
  //   let project = {
  //     "id": this.projectId,
  //     "name": "App9adsfds",
  //     "image": "assets/images/beaverplastics.png",
  //     "tags": null,
  //     "url": 'sdf',
  //     "type": null
  //   }
  //   // this.projectService.putProject(project).subscribe(result => {
  //   //   console.log(result)
  //   // })

  //   this.store.saveProject(project)
  // }

  deleteProject() {
    // this.projectService.deleteProject(this.projectId).subscribe(result => {
    //   console.log(result)
    // })
    this.store.deleteProject(this.projectId)
    this.router.navigateByUrl('/grid/asc');
  }

}
