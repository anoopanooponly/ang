/**********************************************************************************
* File Name   :   HeatmapComparisonComponent.ts
* Description :   Heatmap Comparison functionalites are implemented in this class
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Router, ActivatedRoute } from '@angular/router';
import { TimeService } from './../../../services/time.service';
import { HeatmapService } from './../../../services/heatmap.service';
import { Camera } from './../../../model/camera';
import { FakecameraService } from './../../../services/fakecamera.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StorageService } from './../../../services/storage.sevice';
import { DateFormat } from './../../../model/date-format';

@Component({
  selector: 'heatmap-comparison',
  templateUrl: './heatmap-comparison.component.html',
  styleUrls: ['./heatmap-comparison.component.css'],
})
export class HeatmapComparisonComponent implements OnInit {
  @Output()
  cancelClicked: EventEmitter<string> = new EventEmitter<string>();
  public heatmapCamera: Camera;
  public loaded: boolean;
  public imageError1: boolean;
  public imageError2: boolean;

  /**
   * Creates an instance of HeatmapComparisonComponent.
   * @param {HeatmapService} heatmapService 
   * @param {TimeService} timeService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {StorageService} storageService 
   * 
   * @memberOf HeatmapComparisonComponent
   */
  constructor(private heatmapService: HeatmapService,
    private timeService: TimeService,
    public router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.heatmapService.comparisonWindowOpen = true;
    this.loaded = false;
    this.heatmapService.setComparisonCookie();
    this.heatmapService.getComparisonCookie();
    this.heatmapService.setDefaultDateForComparison();
    //console.log();

    if (this.heatmapCamera == null) {
      this.heatmapCamera = new Camera();
    }
    let cameraId = this.heatmapService.heatmapComparisonCameraId;
    if (this.heatmapService.heatMapAFromDate != undefined && this.heatmapService.heatMapAToDate != undefined) //
    {
      let from = this.timeService.getDateFormatted3(this.heatmapService.heatMapAFromDate);
      let to = this.timeService.getDateFormatted3(this.heatmapService.heatMapAToDate);
      this.heatmapCamera.heatmapCam1Url = this.heatmapService.getHeatMapSelectedRangeUrl(cameraId, from, to);
    }
    else //Default Date
    {
      this.heatmapCamera.heatmapCam1Url = this.heatmapService.getDefaultHeatMapUrl(cameraId, this.heatmapService.selectedStoreZone);
    }

    if (this.heatmapService.heatMapBFromDate != undefined && this.heatmapService.heatMapBToDate != undefined) {
      let from = this.timeService.getDateFormatted3(this.heatmapService.heatMapBFromDate);
      let to = this.timeService.getDateFormatted3(this.heatmapService.heatMapBToDate);
      this.heatmapCamera.heatmapCam2Url = this.heatmapService.getHeatMapSelectedRangeUrl(cameraId, from, to);
    }
    else //Default Date
    {
      this.heatmapCamera.heatmapCam2Url = this.heatmapService.getDefaultHeatMapUrl(cameraId, this.heatmapService.selectedStoreZone);
    }

    this.loaded = true;
    this.heatmapService.selectedDateRangeInCalendar = this.heatmapService.selectedDateRangeA;// By default Heatmap A is selected.     
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapComparisonComponent
   */
  ngOnInit() {
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapComparisonComponent
   */
  ngOnDestroy() {
    this.heatmapService.comparisonWindowOpen = false;
    this.heatmapService.calendarPopupOn = false;
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapComparisonComponent
   */
  public onCancelClick() {
    this.cancelClicked.emit('');

  }

  /**
   * 
   * Close comparison screen
   * 
   * @memberOf HeatmapComparisonComponent
   */
  close() {
    this.heatmapService.selectedDateRangeInCalendar = this.heatmapService.selectedDateRange;
    this.heatmapService.isDateRangeSelectedForA = false;
    this.heatmapService.isDateRangeSelectedForB = false;
    this.heatmapService.comparisonWindowOpen = false;
    this.heatmapService.singleCameraView = false;
    this.heatmapService.isDateRangeSelectedForLarge = false;
    this.router.navigate(['heatmap', { heatmap: this.heatmapService.heatmapOn }], { relativeTo: this.route });

  }

  /**
   * 
   * on heatmap A thumb nail click
   * 
   * @memberOf HeatmapComparisonComponent
   */
  public heatmapAClick() {
    this.heatmapService.heatMapLargeFromDate = this.heatmapService.heatMapAFromDate;
    this.heatmapService.heatMapLargeToDate = this.heatmapService.heatMapAToDate;

    this.heatmapService.comparisonLargeUrl = this.heatmapCamera.heatmapCam1Url;
    this.heatmapService.selectedDateRangeLarge = this.heatmapService.selectedDateRangeA;
    this.heatmapService.singleCameraView = true;
    this.router.navigate(["../../heatmapcomparisonlarge/" + this.heatmapService.heatmapComparisonCameraId], { relativeTo: this.route });
  }

  /**
   * 
   *  on heatmap B thumb nail click
   * 
   * @memberOf HeatmapComparisonComponent
   */
  public heatmapBClick() {
    this.heatmapService.heatMapLargeFromDate = this.heatmapService.heatMapBFromDate;
    this.heatmapService.heatMapLargeToDate = this.heatmapService.heatMapBToDate;

    this.heatmapService.comparisonLargeUrl = this.heatmapCamera.heatmapCam2Url;
    this.heatmapService.selectedDateRangeLarge = this.heatmapService.selectedDateRangeB;
    this.heatmapService.singleCameraView = true;
    this.router.navigate(["../../heatmapcomparisonlarge/" + this.heatmapService.heatmapComparisonCameraId], { relativeTo: this.route });
  }
}
