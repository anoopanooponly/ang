
/**********************************************************************************
* File Name   :   LibraryResolver.ts
* Description :   Library route resolver
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Constants } from './../../../model/constants';
import { CookieService } from './../../../services/cookie.service';
import { LibraryService } from './../../../services/library.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActionService } from './../../../services/action.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { VideoService } from './../services/video.service';


@Injectable()
export class LibraryResolver implements Resolve<any> {
  constructor(
    private libraryService: LibraryService,
    private cookieService: CookieService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let visibility = route.params["visibility"];
    if(visibility != null && visibility != '' && visibility != 'undefined') {
      this.libraryService.setVisibilityOption(visibility);
    }
    
    let LibGroupBy = this.libraryService.PageName;
    if (LibGroupBy == null || LibGroupBy == '' || LibGroupBy == undefined) {
      LibGroupBy = this.cookieService.getCookieGroupBy();
      if (LibGroupBy == null || LibGroupBy == '' || LibGroupBy == undefined) {
        this.libraryService.LibraryGroupBy = Constants.UNGROUPED;
      }
    }
    this.libraryService.LibraryGroupBy = LibGroupBy;
    this.libraryService.PageName = LibGroupBy;
    return LibGroupBy;

  }
}


