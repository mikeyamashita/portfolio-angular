import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ProjectService } from './project/services/project.service';
import { Project } from './project/models/project';
import { ProjectStore } from './project/store/project.store';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/services/auth.service';
import { GridService } from './grid/grid.service/grid.service';
import { AuthResponse } from './auth/model/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule],
  // providers: [ProjectStore],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly dialog = inject(MatDialog);
  readonly store = inject(ProjectStore);

  title = 'host';
  isOpened: boolean = false;
  projects: Array<Project> = new Array<Project>();

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private gridService: GridService,
    private projectService: ProjectService,
    private location: Location,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.store.getProjects();

    // this.drawer.toggle()
    setTimeout(() => {
      this.isOpened = true;
    }, 250)
  }

  showGrid() {
    this.router.navigateByUrl("/grid/" + this.gridService.sorttype())
    // console.log(this.route.snapshot.url[0].path)
    // this.location.back()
  }

  lockunlock() {
    if (this.authService.token) {  // Assuming token is a property
      this.authService.token.set(null);
      localStorage.clear();
    } else {
      const dialogRef = this.dialog.open(AuthComponent);
      dialogRef.afterClosed().subscribe((user) => {
        console.log(`Dialog result:`, user);

        if (user) {
          this.authService.login<AuthResponse>(user).subscribe((res: AuthResponse) => {
            if (res && "accessToken" in res) {
              localStorage.setItem("token", res.accessToken);
              this.authService.token.set(res.accessToken);
            } else {
              console.error("Login response does not contain accessToken");
            }
          });
        }
      });
    }
  }


}
