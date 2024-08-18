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
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { LinkStore } from './store/link.store';
import { Link } from './models/link';
import { LinkService } from './services/link.service';

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
  readonly linkStore = inject(LinkStore);
  readonly dialog = inject(MatDialog);

  projectId: number = -1;
  project: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    public projectService: ProjectService,
    private linkService: LinkService,
    public authService: AuthService) {
    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.
      const state = getState(this.store);
      // console.log('project state changed', state);
    })
  }

  // Lifecycle
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = Number(params["id"])

      this.linkStore.getLinks()

      if (this.store.projects().length == 0 || this.store.project())
        this.store.getProjectById(this.projectId)
      else
        this.store.filterProjectById(this.projectId)
    })
  }

  // Events  
  updateProject() {
    const dialogRef = this.dialog.open(ProjectFormComponent, { data: this.project, width: '90%' });

    dialogRef.afterClosed().subscribe(project => {
      if (project) {

        //find differences between links array from the form and store
        const linksToAdd = project.links.filter((link: Link) => !this.store.project().links.includes(link));
        const linksToRemove = this.store.project().links.filter((link: Link) => !project.links.includes(link));

        console.log('project from form:', project.links)
        console.log('project:', this.store.project().links)
        console.log('linksToAdd:', linksToAdd)
        console.log('linksToRemove:', linksToRemove)

        linksToAdd.forEach((link: Link) => {
          if (link.id)
            if (link.id < 0)
              this.linkStore.addLink(link)
        })

        linksToRemove.forEach((link: Link) => {
          if (link.id)
            this.linkStore.deleteLink(link.id)
        })

        this.store.saveProject(project)
        this.projectService.project.set(project)
      }
    });
  }

  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm)
        this.store.deleteProject(this.projectId)
      this.router.navigateByUrl('/grid/asc');
    });
  }
}
