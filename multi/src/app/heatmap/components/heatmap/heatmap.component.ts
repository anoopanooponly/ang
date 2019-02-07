
/**********************************************************************************
* File Name   :   HeatmapComponent.ts
* Description :   Heatmap functionalites are implemented in this class
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { TimeService } from './../../../services/time.service';
import { HeatmapService } from './../../../services/heatmap.service';
import { CookieService } from './../../../services/cookie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { DatePickerModule } from 'ng2-datepicker';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  public fromDateHeatmap;
  public toDateHeatmap;
  public calendarIconHidden;
  public imagePath;
  private clicked = false;

  /**
   * Creates an instance of HeatmapComponent.
   * @param {Router} router 
   * @param {CookieService} cookieService 
   * @param {HeatmapService} heatmapService 
   * @param {ActivatedRoute} route 
   * @param {TimeService} timeService 
   * 
   * @memberOf HeatmapComponent
   */
  constructor(private router: Router,
    private cookieService: CookieService,
    private heatmapService: HeatmapService,
    private route: ActivatedRoute,
    private timeService: TimeService
  ) {
    this.heatmapService.heatmapOn = cookieService.getCookieHeatmapOn();
    this.heatmapService.heatmapOn = this.heatmapService.heatmapOn == undefined ? false : this.heatmapService.heatmapOn;
    this.calendarIconHidden = !this.heatmapService.heatmapOn;
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapComponent
   */
  ngOnInit() {
    //var date: moment.Moment;
  }

  /**
   * On heatmap icon click
   * 
   * @private
   * 
   * @memberOf HeatmapComponent
   */
  private onHeatmapClick(): void {
    this.heatmapService.heatmapOn = !this.heatmapService.heatmapOn;
    this.calendarIconHidden = !this.heatmapService.heatmapOn;
    this.cookieService.setCookieHeatmapOn(this.heatmapService.heatmapOn);
    //this.heatmapService.setDefaultDateRange();
    this.heatmapService.isDateRangeSelected = false;
    if (this.heatmapService.heatmapOn) {
      this.setHeatmapOn();
    }
    else {
      this.setHeatmapOff();
    }
  }

  /**
   * get heatmap icon - returns one of the icons for heatmapOn or heatmapOff
   * 
   * @returns 
   * 
   * @memberOf HeatmapComponent
   */
  public getHeatmapImage() {
    let imagePath = this.heatmapService.heatmapOn == false ? 'assets/img/heat_inactive.png' : 'assets/img/heat_active.png';
    return imagePath;
  }

  /**
   * on heatmap calendar click..
   * 
   * @private
   * 
   * @memberOf HeatmapComponent
   */
  private onCalendarClick() {
    // this.popupHidden = false;
    this.heatmapService.calendarPopupOn = true;
    this.clicked = true;
  }

  /**
   * on clicking the button of heatmap calendar..
   * 
   * @param {any} event 
   * 
   * @memberOf HeatmapComponent
   */
  public calenderDoneButtonClick(event) {
    this.clicked = false;
    if (event.isDoneClicked) {
      if (this.heatmapService.singleCameraView) {
        this.heatmapService.isDateRangeSelectedForLarge = true;
        this.router.navigate(['./heatmapcomparisonlarge/' + this.heatmapService.heatmapComparisonCameraId, { range: this.heatmapService.selectedDateRangeLarge }], { relativeTo: this.route });
      }
      else {
        this.setHeatmapOn();
      }
    }
    this.heatmapService.calendarPopupOn = false;
  }

  /**
   * set heatmap on, set ranges, redirect to the gallery with heatmap images.
   * 
   * @private
   * 
   * @memberOf HeatmapComponent
   */
  private setHeatmapOn() {
    var heatOn = this.heatmapService.heatmapOn;

    if (this.heatmapService.heatMapFromDate == undefined) {
      this.heatmapService.setDefaultDateRanges();
    }

    //range is calculated only for routing. range values is not used any where else..
    let dFrom = this.timeService.getFormattedDate2(this.heatmapService.heatMapFromDate);
    let dTo = this.timeService.getFormattedDate2(this.heatmapService.heatMapToDate);
    let range = dFrom + '-' + dTo;
    if (this.heatmapService.comparisonWindowOpen) {
      dFrom = this.timeService.getFormattedDate2(this.heatmapService.heatMapAFromDate);
      dTo = this.timeService.getFormattedDate2(this.heatmapService.heatMapAToDate);
      range = dFrom + '-' + dTo;
      dFrom = this.timeService.getFormattedDate2(this.heatmapService.heatMapBFromDate);
      dTo = this.timeService.getFormattedDate2(this.heatmapService.heatMapBToDate);
      range += dFrom + '-' + dTo;
      this.router.navigate(["./"], { relativeTo: this.route }).then(() => {
        this.router.navigate(["heatmap/" + this.heatmapService.heatmapComparisonCameraId], { relativeTo: this.route });
      });
    }
    else {

      this.router.navigate(['./', { heatmap: heatOn + range }], { relativeTo: this.route });
    }
  }

  /**
   * set heatmap off, redirect to the gallery with non heatmap images.
   * 
   * @private
   * 
   * @memberOf HeatmapComponent
   */
  private setHeatmapOff() {
    let videoType = this.cookieService.getCookieVideoType();
    let storeId = this.cookieService.getCookieSelectedStore();
    let viewId = this.cookieService.getCookieSelectedView();
    let siteid = videoType == "store" ? storeId : viewId;
    this.heatmapService.calendarPopupOn = false;

    this.heatmapService.comparisonWindowOpen = false;
    this.heatmapService.isDateRangeSelected = false;
    this.router.navigate(['/video/' + videoType + '/' + siteid, { heatmap: 'Off' }]);
  }
}
