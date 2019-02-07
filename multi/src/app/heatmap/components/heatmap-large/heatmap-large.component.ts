
/**********************************************************************************
* File Name   :   HeatmapLargeComponent.ts
* Description :   Heatmap Single Camera View functionalites are implemented in this class
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { TimeService } from './../../../services/time.service';
import { Constants } from './../../../model/constants';
import { Camera } from './../../../model/camera';
import { Router, ActivatedRoute } from '@angular/router';
import { HeatmapService } from './../../../services/heatmap.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'heatmap-large',
  templateUrl: './heatmap-large.component.html',
  styleUrls: ['./heatmap-large.component.css']
})
export class HeatmapLargeComponent implements OnInit {

  private routeSub: any;
  public loaded: boolean;
  public imageError: boolean;
  private heatmapLargeUrl: string;

  /**
   * Creates an instance of HeatmapLargeComponent.
   * @param {HeatmapService} heatmapService 
   * @param {TimeService} timeService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf HeatmapLargeComponent
   */
  constructor(public heatmapService: HeatmapService,
    public timeService: TimeService,
    public router: Router,
    private route: ActivatedRoute) {
    this.loaded = false;
  }

  /**
   * 
   * Set heatmap range, cameraid, from to, url values
   * 
   * @memberOf HeatmapLargeComponent
   */
  ngAfterViewInit() {
    this.heatmapService.setHeatmapLargeCookie();
    this.heatmapService.getHeatmapLargeCookie();
    let that = this;
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        that.heatmapService.comparisonWindowOpen = false;
        that.heatmapService.singleCamRangeForCalendar = that.heatmapService.selectedDateRangeLarge;
        let from = that.timeService.getDateFormatted3(that.heatmapService.heatMapLargeFromDate);
        let to = that.timeService.getDateFormatted3(that.heatmapService.heatMapLargeToDate);
        let camId = that.heatmapService.heatmapComparisonCameraId;
        that.heatmapLargeUrl = that.heatmapService.getHeatMapSelectedRangeUrl(camId, from, to, Constants.HIGH_RESOLUTION);

        that.loaded = false;
      });
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapLargeComponent
   */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    
    //Restore the date range for single calender popup
    this.heatmapService.selectedDateRangeNormal = this.heatmapService.selectedDateRange;
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapLargeComponent
   */
  ngOnInit() {
  }


  /**
   * 
   * on heatmap single view close
   * 
   * @memberOf HeatmapLargeComponent
   */
  close() {
    this.heatmapService.singleCameraView = false;
    this.heatmapService.isDateRangeSelectedForA = false;
    this.heatmapService.isDateRangeSelectedForB = false;
    this.heatmapService.comparisonWindowOpen = false;
    this.heatmapService.isDateRangeSelectedForLarge = false;
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapLargeComponent
   */
  onload() {
    this.loaded = true;
  }

  /**
   * 
   * on image error in heatmap single camera 
   * 
   * @memberOf HeatmapLargeComponent
   */
  public onError() {
    this.imageError = true;
    this.loaded = true;
  }
}
