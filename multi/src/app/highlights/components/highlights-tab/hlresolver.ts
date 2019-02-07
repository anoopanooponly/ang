/**********************************************************************************
* File Name   :   HLResolver.ts
* Description :   Highlights resolver 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { HighlightsService } from './../../../services/highlights.service';
import { HlGroup } from './../../models/hl-group';
import { CookieService } from './../../../services/cookie.service';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { FilterDataHandler } from './utilities/filter-data-handler';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { VideoService } from './services/video.service';
import { ActionService } from './services/action.service';

@Injectable()
export class HLResolver implements Resolve<any> {
    constructor(
        private actionBarCommunicationService: ActionBarCommunicationService,
        private router: Router,
        private cookieService: CookieService,
        private highlightsService: HighlightsService
    ) {

    }

    /**
     * 
     * 
     * @param {ActivatedRouteSnapshot} route 
     * @param {RouterStateSnapshot} state 
     * 
     * @memberOf HLResolver
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let selectedGroup = this.cookieService.getCookieGroupBy();
        if (selectedGroup == null) {
            selectedGroup = HlGroup.UNGROUPED;
        }
        this.highlightsService.PageName = selectedGroup;
        this.highlightsService.GroupBy = selectedGroup;
        this.router.navigate(['/highlights/' + selectedGroup]);
    }
}


