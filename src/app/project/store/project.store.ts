import { computed, inject } from '@angular/core';
import { concat, concatMap, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
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
import { Link } from '../models/link';
import { LinkService } from '../services/link.service';

type ProjectState = {
    id: number,
    project: any,
    projects: Array<any>;
    links: Array<Link>
    isSavingProject: boolean,
    isLoading: boolean;
    isLoadingProject: boolean;
};

const initialState: ProjectState = {
    id: 0,
    project: [],
    projects: new Array<any>(),
    links: new Array<Link>(),
    isSavingProject: false,
    isLoading: false,
    isLoadingProject: false
};

export const ProjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ projects }) => ({
        projectsCount: computed(() => projects().length),
        projectsList: computed(() => projects())
    })),
    withMethods((store, projectService = inject(ProjectService), linkService = inject(LinkService)) => ({
        setProjectId(projectid: number): void {
            patchState(store, { id: projectid });
        },
        filterProjectById(projectid: number): void {
            let project = store.projects().filter(project => project.id === projectid)[0]
            patchState(store, { project: project })
        },
        newProject(): void {
            patchState(store, { project: [] })
        },
        getProjectById: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoadingProject: true })),
                switchMap((id) => {
                    return projectService.getProjectById(id).pipe(
                        tapResponse({
                            next: (project: any) => {
                                patchState(store, { project })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoadingProject: false }),
                        })
                    );
                })
            )
        ),
        getLinksByProjectId: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoadingProject: true })),
                switchMap((id) => {
                    return projectService.getLinksByProjectId(id).pipe(
                        tapResponse({
                            next: (links: Array<any>) => {
                                patchState(store, { links })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoadingProject: false }),
                        })
                    );
                })
            )
        ),
        getProjects: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
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
                tap(() => patchState(store, { isSavingProject: true })),
                switchMap((project: any) => {
                    return projectService.putProject(project).pipe(
                        tapResponse({
                            next: (res: any) => {
                                patchState(store, { project: project })
                                // replace updated project
                                patchState(store, (state: any) => ({ project: state.projects.splice(state.projects.findIndex((item: any) => project.id == item.id), 1, project) }))
                                if (project.id)
                                    projectService.getProjectById(project.id)
                            },
                            error: console.error,
                            finalize: () => {
                                patchState(store, { isSavingProject: false })
                            }
                        })
                    );
                })
            )
        ),
        addProject: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isSavingProject: true })),
                concatMap((project: any) => {
                    return projectService.postProject(project).pipe(
                        tapResponse({
                            next: (res: any) => {
                                store.projects().push(res)
                                // patchState(store, (state: any) => ({ projects: state.projects.push(project) }))
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isSavingProject: false }),
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