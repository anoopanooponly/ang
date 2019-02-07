import { PlayerService } from './services/player.service';
import { FilterData } from './model/filter-data';
import { FilterService } from './services/filter.service';
import { CookieService } from './services/cookie.service';
import { FilterDataHandler } from './utilities/filter-data-handler';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ActionService } from './services/action.service';
import * as _ from 'lodash';

@Injectable()
export class DataResolver implements Resolve<any> {
  constructor(private actionService: ActionService,
    private cookieService: CookieService,
    private playerService: PlayerService) {
   

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    

    return Observable.forkJoin(this.actionService.getStores(), this.actionService.getViews(), this.playerService.loadYamsBaseUrl());
  }
}

// an array of services to resolve routes with data
export const APP_RESOLVER_PROVIDERS = [
  DataResolver
];
