import { computed, inject } from '@angular/core';
import { debounceTime, delay, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ProjectService } from '../services/project.service';

type ProjectState = {
    id: number,
    project: any,
    projects: Array<any>;
    isLoading: boolean;
};

const initialState: ProjectState = {
    id: 0,
    project: [],
    projects: new Array<any>(),
    isLoading: false,
};

export const ProjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ projects }) => ({
        projectsCount: computed(() => projects().length),
        projectsList: computed(() => projects())
    })),
    withMethods((store, projectService = inject(ProjectService)) => ({
        setProjectId(projectid: number): void {
            patchState(store, { id: projectid });
        },
        getProjectById(projectid: number): any {
            projectService.getProjectById(projectid);
        },
        getProjects: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                delay(3000),
                switchMap(() => {
                    return projectService.getProjects().pipe(
                        tapResponse({
                            next: (projects: any) => {
                                patchState(store, { projects })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        saveProject: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap((project: any) => {
                    return projectService.putProject(project).pipe(
                        tapResponse({
                            next: (res: any) => {
                                patchState(store, { project: project })
                                // replace updated project
                                patchState(store, (state: any) => ({ project: state.projects.splice(state.projects.findIndex((item: any) => project.id == item.id), 1, project) }))

                                projectService.getProjectById(project.id)
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        addProject: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap((project: any) => {
                    return projectService.postProject(project).pipe(
                        tapResponse({
                            next: (res: any) => {
                                store.projects().push(res)
                                // patchState(store, (state: any) => ({ projects: state.projects.push(project) }))
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        deleteProject: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap((id) => {
                    return projectService.deleteProject(id).pipe(
                        tapResponse({
                            next: (res: any) => {
                                // remove deleted from store
                                patchState(store, (state: any) => ({ projects: state.projects.filter((project: any) => project.id !== id) }))
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        )
    }))
);