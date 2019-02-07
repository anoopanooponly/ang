/**********************************************************************************
* File Name   :   PeopleDataResolver.ts
* Description :   PeopleDataResolver
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { ActionService } from './../services/action.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';

@Injectable()
export class PeopleDataResolver implements Resolve<any> {

  /**
   * Creates an instance of PeopleDataResolver.
   * @param {ActionService} actionService 
   * 
   * @memberOf PeopleDataResolver
   */
  constructor(private actionService: ActionService) {
   

  }

  /**
   * 
   * 
   * @param {ActivatedRouteSnapshot} route 
   * @param {RouterStateSnapshot} state 
   * @returns 
   * 
   * @memberOf PeopleDataResolver
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
     return this.actionService.getStores();
  }
}

// an array of services to resolve routes with data
export const PEOPLE_RESOLVER_PROVIDERS = [
  PeopleDataResolver
];
