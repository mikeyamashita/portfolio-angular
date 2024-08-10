import { Injectable, signal } from '@angular/core';
import { ApiService } from '../../_helpers/api.service';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  sorttype = signal('asc')

  constructor(private apiService: ApiService) {
    this.apiService.setEnvironment()
  }
}
