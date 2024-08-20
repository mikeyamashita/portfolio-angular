import { Routes } from '@angular/router';

import { GridPage } from './grid/grid.page';
import { ProjectComponent } from './project/project.component';
import { ProjectNewUpdateComponent } from './project/components/project-new-update/project-new-update.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'grid/asc',
        pathMatch: 'full'
    },
    {
        path: 'grid/:sort',
        component: GridPage
    },
    {
        path: 'project/:id',
        component: ProjectComponent
    },
    {
        path: 'project/:id/edit',
        component: ProjectNewUpdateComponent
    }
];
