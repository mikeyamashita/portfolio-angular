import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  sorttype = signal('asc')

  constructor() { }
}
