import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {ListService} from "../list.service";
import { WorkerList } from '../../model/list.model';

@Injectable()
export class ListDetailResolver implements Resolve<Observable<WorkerList>> {
  constructor(
    private listService: ListService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if(route.params.id)
      return this.listService.getListDetail(route.params.id);
    else
      return Observable.of(this.listService.getEmptyList());
  }
}
