import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { getState } from '@ngrx/signals';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { ProjectService } from './services/project.service';
import { ProjectStore } from './store/project.store';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { AuthService } from '../auth/services/auth.service';
import { LinkStore } from './store/link.store';
import { MatLabel } from '@angular/material/form-field';
import { GridService } from '../grid/grid.service/grid.service';

@Component({
  selector: 'my-project',
  standalone: true,
  imports: [MatButtonModule, MatIconModule,
    MatCardModule, MatDialogModule,
    RouterModule, MatChipsModule,
    MatProgressSpinnerModule, MatLabel,
    ProjectFormComponent],
  // providers: [ProjectStore],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {

  readonly store = inject(ProjectStore);
  readonly linkStore = inject(LinkStore);

  projectId: string = "-1";
  project: any;
  new: any;
  dateRange: string = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    public projectService: ProjectService,
    public authService: AuthService,
    private gridService: GridService) {
    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.
      const state = getState(this.store);
      // console.log('project state changed', state);
    })
  }

  // Lifecycle
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];

      if (this.projectId == 'new') {
        console.log('new')
        this.store.newProject();
        this.projectService.project.set(new Array<any>());
        this.router.navigateByUrl('/project/' + this.projectId + '/edit');
      } else {
        this.linkStore.getLinks()
        if (this.store.projects().length == 0 || this.store.project())
          this.store.getProjectById(Number(this.projectId))
        else
          this.store.filterProjectById(Number(this.projectId))
      }
    })
  }

  // Methods
  getMonthYear(date: string): string {
    return this.projectService.getMonthYear(date)
  }

  // Events  
  updateProject() {
    this.router.navigateByUrl('/project/' + this.projectId + '/edit');
  }

  navigateToGrid() {
    // this.location.back()
    console.log(this.router.lastSuccessfulNavigation?.previousNavigation)
    this.router.navigateByUrl('/grid/' + this.gridService.sorttype());
  }
}
