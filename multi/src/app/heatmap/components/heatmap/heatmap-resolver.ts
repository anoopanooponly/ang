
/**********************************************************************************
* File Name   :   HeatmapResolver.ts
* Description :   Heatmap route resolver
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { TimeService } from './../../../services/time.service';
import { HeatmapService } from './../../../services/heatmap.service';
import { Constants } from './../../model/constants';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


@Injectable()
export class HeatmapResolver implements Resolve<any> {
    constructor(
        private heatmapService: HeatmapService,
        private timeService: TimeService
        ) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        this.heatmapService.comparisonWindowOpen = false;
        let heatmapLargeUrl;
        // if (this.heatmapService.isDateRangeSelectedForLarge) //
        // {
        //     heatmapLargeUrl = this.heatmapService.getHeatMapUrlforSelectedRange(this.heatmapService.heatmapComparisonCameraId, Constants.HIGH_RESOLUTION);
        // }
        // else //Default Date
        // {
        //     heatmapLargeUrl = this.heatmapService.getDefaultHeatMapUrl(this.heatmapService.heatmapComparisonCameraId, Constants.HIGH_RESOLUTION);
        // }
        // this.heatmapService.comparisonLargeUrl = heatmapLargeUrl;
        if (this.heatmapService.isDateRangeSelectedForLarge) //
        {
            let from = this.timeService.getDateFormatted3(this.heatmapService.heatMapLargeFromDate);
            let to = this.timeService.getDateFormatted3(this.heatmapService.heatMapLargeToDate);
            let camId = this.heatmapService.heatmapComparisonCameraId;
            this.heatmapService.comparisonLargeUrl = this.heatmapService.getHeatMapSelectedRangeUrl(camId, from, to, Constants.HIGH_RESOLUTION);
        }
        else //Default Date
        {
            this.heatmapService.comparisonLargeUrl = this.heatmapService.getDefaultHeatMapUrl(this.heatmapService.heatmapComparisonCameraId, Constants.HIGH_RESOLUTION);
        }

        return heatmapLargeUrl;
    }
}


