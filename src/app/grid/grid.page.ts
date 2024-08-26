import { Component, OnInit, ChangeDetectionStrategy, inject, afterNextRender, effect, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { getState } from '@ngrx/signals';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectService } from '../project/services/project.service';
import { ProjectStore } from '../project/store/project.store';
import { AuthService } from '../auth/services/auth.service';
import { GridService } from './grid.service/grid.service';
import { FormsModule } from '@angular/forms';
import { GitHubIcon } from "../../assets/icons/github-mark";

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    GitHubIcon
  ],
  // providers: [ProjectStore],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid.page.html',
  styleUrls: ['./grid.page.scss']
})
export class GridPage implements OnInit {

  // @ViewChild('searchText', { static: true })
  // searchText!: MatInput;
  search!: string;

  readonly store = inject(ProjectStore);
  readonly dialog = inject(MatDialog);

  projects: Array<any> = new Array<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gridService: GridService,
    public authService: AuthService,
    private projectService: ProjectService,
  ) {
    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.
      const state = getState(this.store);
      console.log('projects state changed', state);

      if (this.store.projects().length) {
        this.projects = state.projects

        this.route.params.subscribe(params => {
          if (params['sort'] == 'asc')
            this.currentSort(1)
          else
            this.currentSort(2)
        })
      }
    });
  }

  // Lifecycle
  ngOnInit() {
    console.log('init')
  }

  ngAfterViewInit() {
    console.log('after init')
  }

  // Methods
  currentSort(sort: number) {
    if (sort == 1) {
      this.store.projects().sort((a, b) => a.id - b.id)
    } else {
      this.store.projects().sort((a, b) => b.id - a.id)
    }
  }

  // Events
  cardClicked(project: any) {
    this.projectService.project.set(project);
    this.router.navigateByUrl('/project/' + project.id);
  }

  addProject() {
    this.router.navigateByUrl('/project/new');
  }

  sortGrid() {
    if (this.gridService.sorttype() == 'asc')
      this.gridService.sorttype.set('desc')
    else
      this.gridService.sorttype.set('asc')
    this.router.navigateByUrl('/grid/' + this.gridService.sorttype())
  }

  filter() {
    this.projects = this.store.projects().filter(project => {
      return project.description?.includes(this.search) || project.name?.includes(this.search) || project.tags?.includes(this.search)
    })
  }

}