import { computed, inject } from '@angular/core';
import { concatMap, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { LinkService } from '../services/link.service';
import { Link } from '../models/link';

type LinkState = {
    id: number,
    link: Link,
    links: Array<Link>;
    isLoading: boolean;
    isLoadingLink: boolean;
};

const initialState: LinkState = {
    id: 0,
    link: new Link(),
    links: new Array<Link>(),
    isLoading: false,
    isLoadingLink: false
};

export const LinkStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ links }) => ({
        linksCount: computed(() => links().length),
        linksList: computed(() => links())
    })),
    withMethods((store, linkService = inject(LinkService)) => ({
        setLinkId(linkid: number): void {
            patchState(store, { id: linkid });
        },
        getLinkById: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoadingLink: true })),
                switchMap((id) => {
                    return linkService.getLinkById(id).pipe(
                        tapResponse({
                            next: (link: Link) => {
                                patchState(store, { link })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoadingLink: false }),
                        })
                    );
                })
            )
        ),
        getLinks: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() => {
                    return linkService.getLinks().pipe(
                        tapResponse({
                            next: (links: Array<Link>) => {
                                console.log(links)
                                patchState(store, { links })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        saveLink: rxMethod<Link>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((link: Link) => {
                    return linkService.putLink(link).pipe(
                        tapResponse({
                            next: (res: Link) => {
                                console.log(res)
                                patchState(store, { link: link })
                                // replace updated link
                                patchState(store, (state: any) => ({ link: state.links.splice(state.links.findIndex((item: Link) => link.id == item.id), 1, link) }))
                                if (link.id)
                                    linkService.getLinkById(link.id)
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        addLink: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((link: Link) => {
                    return linkService.postLink(link).pipe(
                        tapResponse({
                            next: (res: Link) => {
                                store.links().push(res)
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        deleteLink: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((id) => {
                    return linkService.deleteLink(id).pipe(
                        tapResponse({
                            next: (res: any) => {
                                // remove deleted from store
                                patchState(store, (state: any) => ({ links: state.links.filter((link: Link) => link.id !== id) }))
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