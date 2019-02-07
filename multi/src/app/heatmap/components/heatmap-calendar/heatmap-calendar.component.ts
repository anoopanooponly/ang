/**********************************************************************************
* File Name   :   HeatmapCalendarComponent.ts
* Description :   Heatmap Calendar functionalites are implemented in this class
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { DateFormat } from './../../../../../src/app/model/date-format';
import { StorageService } from './../../../services/storage.sevice';
import { DateRangeValidatorService } from './../../../../lib/mydaterangepicker/srcds/my-date-range-picker/services/my-date-range-picker.date.range.validator.service';
import * as moment from './../../../../node_modules/moment-timezone/moment-timezone';
import { TimeService } from './../../../services/time.service';
import { HeatmapService } from './../../../services/heatmap.service';
import { CalendarData } from './../../../model/calendar-data';
import { Component, OnInit, Output, Input, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { NgModule } from "@angular/core";

@Component({
  selector: 'heatmap-calendar',
  templateUrl: './heatmap-calendar.component.html',
  styleUrls: ['./heatmap-calendar.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatmapCalendarComponent implements OnInit {

  @Output()
  buttonClicked: EventEmitter<CalendarData> = new EventEmitter();
  heatmapASelected: boolean = false;
  heatmapBSelected: boolean = false;
  heatmapSelected: boolean = false;
  public fromDate: DateFormat;
  public toDate: DateFormat;
  public fromDateLarge: DateFormat;
  public toDateLarge: DateFormat;
  private fromDateA: DateFormat;
  private toDateA: DateFormat;
  private fromDateB: DateFormat;
  private toDateB: DateFormat;
  private range;
  private rangeLarge;
  private calObj = {
    selectedDateRangeNormal: '',
    selectedDateRangeNormalA: '',
    selectedDateRangeNormalB: '',
    heatMapSelectedFromDate: new DateFormat(),
    heatMapSelectedToDate: new DateFormat(),
    isDateRangeSelected: false,
  }
  myDateRangePickerOptionsNormal = {
    dateFormat: 'mmm dd, yyyy',
    showClearButton: true
  };


  public fromDateHeatmap;
  public toDateHeatmap;
  public comparisonWindowClosed: boolean;
  public disableTargaryens;
  public disableBaratheon;
  public day: number;
  public month: number;
  public year: number;
  @Input() clicked;


  /**
   * Creates an instance of HeatmapCalendarComponent.
   * @param {HeatmapService} heatmapService 
   * @param {TimeService} timeService 
   * @param {StorageService} storageService 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  constructor(public heatmapService: HeatmapService,
    public timeService: TimeService,
    private storageService: StorageService
  ) {
    this.heatmapService.restoreFromStorage();
    if (this.heatmapService.selectedDateRangeNormal == null) {//If values could not be retreived from storage.
      this.setDefaultDateRange();
    }
  }

  /**
   * 
   * 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  ngOnInit() {
  }


  /**
   * 
   * This method sets the default ranges for heatmap calenders.
   * 
   * @memberOf HeatmapCalendarComponent
   */
  setDefaultDateRange() {
    this.fromDate = this.timeService.getDateYesterdayFormatted(this.heatmapService.selectedStoreZone);
    this.toDate = this.fromDate;
    this.range = this.fromDate + ' - ' + this.toDate;
    let currentDate = this.timeService.getServerPreviousDate(this.heatmapService.selectedStoreZone)
    this.heatmapService.heatMapFromDate = currentDate;
    this.heatmapService.heatMapToDate = currentDate;
    this.heatmapService.selectedDateRangeNormal = this.range;
    this.heatmapService.selectedDateRange = this.range;
    this.heatmapService.selectedDateRangeInCalendar = this.range;
    this.heatmapService.selectedDateRangeInGallery = this.range;
    this.heatmapService.setDateRangeB(currentDate, currentDate);
  }

  /**
   * 
   * On calendar cancel button click.
   * 
   * @memberOf HeatmapCalendarComponent
   */
  onCancelClick() {

    let calendarData = new CalendarData();
    calendarData.isDoneClicked = false;
    //this.buttonClicked.emit(calendarData);
    this.heatmapService.calendarPopupOn = false;
    this.clicked = false;

  }

  /**
   * 
   * On calendar done button click..
   * 
   * @memberOf HeatmapCalendarComponent
   */
  onDoneClick() {
    this.heatmapService.isDateRangeSelectedForA = this.heatmapASelected;
    this.heatmapService.isDateRangeSelectedForB = this.heatmapBSelected;
    let calendarData = new CalendarData();
    this.clicked = false;
    calendarData.isDoneClicked = true;
    if (this.heatmapService.singleCameraView) {
      this.heatmapService.isDateRangeSelectedForLarge = true;
      if (this.rangeLarge != undefined) {
        this.heatmapService.singleCamRangeForCalendar = this.rangeLarge;
        this.heatmapService.selectedDateRangeLarge = this.rangeLarge;
      }
      if (this.fromDateLarge != undefined) {
        this.heatmapService.heatMapLargeFromDate = this.fromDateLarge;
      }
      if (this.toDateLarge != undefined) {
        this.heatmapService.heatMapLargeToDate = this.toDateLarge;
      }
      this.heatmapService.setDateRangeSingleCam(this.heatmapService.heatMapLargeFromDate, this.heatmapService.heatMapLargeToDate);
    }
    else if (this.heatmapService.comparisonWindowOpen)//
    {
      if (this.heatmapBSelected)//
      {
        this.heatmapService.isDateRangeSelectedForA = true;//If date A or B selected in calendar, A should not be updated according to B
        this.heatmapService.setDateRangeB(this.fromDateB, this.toDateB)
      }
      if (this.heatmapASelected)// 
      {
        this.heatmapService.setDateRangeA_CalendarClick(this.fromDateA, this.toDateA)
      }
    }
    else//
    {
      if (this.range != undefined) {
        this.heatmapService.selectedDateRangeNormal = this.range;
      }
      if (this.fromDate) {
        this.heatmapService.heatMapFromDate = this.fromDate;
      }
      if (this.toDate) {
        this.heatmapService.heatMapToDate = this.toDate;
      }
      this.heatmapSelected = true;
      this.heatmapService.isDateRangeSelected = this.heatmapSelected;
      this.heatmapService.setDateRange(this.heatmapService.heatMapFromDate, this.heatmapService.heatMapToDate)
    }
    this.heatmapService.saveToStorage();
    this.buttonClicked.emit(calendarData);
  }

  /**
   * get date object from day, month and year.
   * 
   * @param {any} day 
   * @param {any} month 
   * @param {any} year 
   * @returns 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  getDate(day, month, year) {
    var d = new DateFormat();
    d.day = day;
    d.month = month;
    d.year = year;
    return d;
  }

  /**
   * checks whether the begin date is larger than end date.
   * 
   * @param {*} beginDate 
   * @param {*} endDate 
   * @returns {boolean} 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  isGreaterthanEnddate(beginDate: any, endDate: any): boolean {
    if (beginDate.year == endDate.year) {
      if (beginDate.month == endDate.month) {
        if (beginDate.day > endDate.day) {
          return true;
        }
      }
      if (beginDate.month > endDate.month) {
        return true;
      }
      if (beginDate.month < endDate.month) {
        return false;
      }
    }


    if (beginDate.year > endDate.year) {
      return true;
    }

  }

  /**
   * on calendar for heatmap A click
   * 
   * @param {any} event 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  onDatechangedA(event) {
    let beginDate = event.beginDate;
    let endDate = event.endDate;
    this.fromDateA = this.getDate(beginDate.day, beginDate.month, beginDate.year);
    this.toDateA = this.getDate(endDate.day, endDate.month, endDate.year);
    let range = this.getRange(this.fromDateA, this.toDateA);
    this.heatmapASelected = true;
    //this.heatmapService.selectedDateRangeInCalendar = range;
  }

  /**
   * on calendar for heatmap B click
   * 
   * @param {any} event 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  onDatechangedB(event) {
    let beginDate = event.beginDate;
    let endDate = event.endDate;
    this.fromDateB = this.getDate(beginDate.day, beginDate.month, beginDate.year);
    this.toDateB = this.getDate(endDate.day, endDate.month, endDate.year);
    let range = this.getRange(this.fromDateB, this.toDateB);
    this.heatmapBSelected = true;
    //this.heatmapService.selectedDateRangeInCalendar = range;
  }

  /**
   * onclick for calendar for heatmap and heatmap single camera view
   * 
   * @param {any} event 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  onDatechanged(event) {
    let beginDate = event.beginDate;
    let endDate = event.endDate;

    if (this.heatmapService.singleCameraView) {
      this.fromDateLarge = this.getDate(beginDate.day, beginDate.month, beginDate.year);
      this.toDateLarge = this.getDate(endDate.day, endDate.month, endDate.year);
      this.rangeLarge = this.getRange(this.fromDateLarge, this.toDateLarge);
      this.heatmapService.selectedDateRangeInCalendar = this.rangeLarge;
      // this.heatmapService.singleCamRangeForCalendar = event.formatted;
    }
    else {
      this.fromDate = this.getDate(beginDate.day, beginDate.month, beginDate.year);
      this.toDate = this.getDate(endDate.day, endDate.month, endDate.year);
      this.range = this.getRange(this.fromDate, this.toDate);
      this.heatmapService.selectedDateRangeInCalendar = this.range;
      // this.heatmapService.selectedDateRangeNormal = event.formatted;
    }
  }

  /**
   * tab change event.
   * 
   * @param {any} selectedTab 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  tabChanged(selectedTab) {
    if (selectedTab.index == 0) {
      this.heatmapService.selectedDateRangeInCalendar = this.heatmapService.selectedDateRangeA;
    }
    else if (selectedTab.index == 1) {
      this.heatmapService.selectedDateRangeInCalendar = this.heatmapService.selectedDateRangeB;
    }
  }

  /**
   * get range from begin date and end date
   * 
   * @param {DateFormat} beginDate 
   * @param {DateFormat} endDate 
   * @returns 
   * 
   * @memberOf HeatmapCalendarComponent
   */
  getRange(beginDate: DateFormat, endDate: DateFormat) {
    let beginDateFormatted = this.timeService.getDateFormatted(beginDate.day, beginDate.month, beginDate.year);
    let endDateFormatted = this.timeService.getDateFormatted(endDate.day, endDate.month, endDate.year);
    let range: any;
    if (this.isGreaterthanEnddate(beginDate, endDate)) {
      range = endDateFormatted + ' - ' + beginDateFormatted;
    }
    else {
      range = beginDateFormatted + ' - ' + endDateFormatted;
    }

    return range;
  }

  // ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
  //   let log: string[] = [];
  //   for (let propName in changes) {
  //     let changedProp = changes[propName];
  //     let to = JSON.stringify(changedProp.currentValue);
  //     if (!changedProp.isFirstChange()) {
  //       let from = JSON.stringify(changedProp.previousValue);
  //       if (to === 'true') {
  //         // console.log("changes");
  //         this.heatmapService.restoreFromStorage();
  //       }
  //     }
  //   }

  // }

}
