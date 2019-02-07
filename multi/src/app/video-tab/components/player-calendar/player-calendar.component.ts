
/**********************************************************************************
* File Name   :   PlayerCalendarComponent.ts
* Description :   This angular component renders a calendar and a time picker section.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ElementRef, Renderer, } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as moment from './../../../../node_modules/moment-timezone/moment-timezone';
import { StorageService } from './../../../services/storage.sevice';
import { ActionService } from './../../../services/action.service';
import { VideoService } from './../../../services/video.service';
import { PlayerService } from './../../../services/player.service';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { CookieService } from './../../../services/cookie.service';
import { TimeService } from './../../../services/time.service';
import { Shift } from './../../../model/shift';
import { PlayerCalendarData } from './../../../model/player-calendar-data';
import { Constants } from './../../../model/constants';
import { PlayerData } from './../../../model/Player-Data';
import { DateFormat } from './../../../model/date-format';

@Component({
  selector: 'player-calendar',
  templateUrl: './player-calendar.component.html',
  styleUrls: ['./player-calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerCalendarComponent implements OnInit {


  @Input() defaultCalendarDate: DateFormat = new DateFormat;
  @Output() buttonClicked: EventEmitter<PlayerData> = new EventEmitter();
  public Date;
  public timeservice;
  timeZoneJson;
  mode: string = '1';
  public placeHolderShift;
  public shiftloaded:boolean;
  private myDateRangePickerOptionsNormal = {

    dateFormat: 'mmm dd, yyyy',

    showClearButton: true

  };
  constant:Constants=new Constants();
  playerDateselected: boolean = false;
  playercaldata: PlayerCalendarData;
  selectedDateRangeNormal: string = '';
  selectedTextNormal: string = '';
  exactTime: string;
  public startDate: DateFormat = new DateFormat();
  playernotifydata: PlayerCalendarData = new PlayerCalendarData();
  shift: Shift[];
  shft: Shift;
  name: string;
  selectedShift: any;
  shiftarray: string[];
  hour: number;
  min: number;
  sec: number;
  hour_range1: number;
  min_range1: number;
  sec_range1: number;
  hour_range2: number;
  min_range2: number;
  sec_range2: number;
  public beginDateString: string;
  endDateString: string;
  public time: string;
  merdian: string = "AM";
  merdian_range1: string;
  merdian_range2: string;
  onShift: boolean = false;
  shiftDate: any;
  src: any;
  isExact: boolean;
  isRange: boolean;
  isDateselected: boolean;
  day: number;
  month: number;
  year: number;
  calObj = {
    mode: '0',
    hour: 0,
    min: 0,
    sec: 0,
    merdian: "AM",
    hour_range1: 0,
    min_range1: 0,
    sec_range1: 0,
    merdian_range1: "AM",

    hour_range2: 0,
    min_range2: 0,
    sec_range2: 0,
    merdian_range2: "AM",
    selectedShift: 0,
    selectedDateRangeNormal: "",
    day: 0,
    month: 0,
    year: 0
  };

  /**
   * Creates an instance of PlayerCalendarComponent.
   * 
   * @param {TimeService} timeService
   * @param {FormBuilder} formBuilder
   * @param {CookieService} cookieService
   * @param {ActionBarCommunicationService} actionBarCommunicationService
   * @param {PlayerService} playerService
   * @param {VideoService} videoService
   * @param {ActionService} actionService
   * @param {StorageService} storageService
   * 
   * @memberOf PlayerCalendarComponent
   */
  constructor(public elem: ElementRef,
   private renderer: Renderer,
   public timeService: TimeService,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private actionBarCommunicationService: ActionBarCommunicationService,
    private playerService: PlayerService,
    public videoService: VideoService,
    private actionService: ActionService,
    private storageService: StorageService) {
     /* renderer.listenGlobal("document", "click", (event: any) => {
            if (this.elem.nativeElement.contains(event.target)) {
              console.log("outside");
             // this.actionService.PopupHidden=true;
              this.actionService.insideCalender=2;
            }
            else{
             this.actionService.insideCalender=3;
            }
           if(this.actionService.insideCalender==3){
                this.actionService.PopupHidden=true;
              }  
  
        });*/
        

    let that = this;
    this.merdian = "AM";
    this.merdian_range1 = "AM";
    this.merdian_range2 = "AM";
    this.defaultCalendarDate.day = Number(this.playerService.playerCalendarDate.day);
    this.defaultCalendarDate.month = Number(this.playerService.playerCalendarDate.month);
    this.defaultCalendarDate.year = Number(this.playerService.playerCalendarDate.year);
  }


 /**
  * 
  * 
  * 
  * @memberOf PlayerCalendarComponent
  */
   ngOnInit() {
  
    this.intializeShift();
    this.selectedDateRangeNormal = this.timeService.getDateFormatted(this.defaultCalendarDate.day, this.defaultCalendarDate.month, this.defaultCalendarDate.year);
    if (!this.playerDateselected) {
      this.startDate.day = this.defaultCalendarDate.day;
      this.startDate.month = this.defaultCalendarDate.month;
      this.startDate.year = this.defaultCalendarDate.year;
      let utcTime = this.timeService.getCurrentUTCTime();
      let timezone = this.playerService.timezone;
      let localTime = this.timeService.getprasedDateAndTime(utcTime, timezone);
      let utcTime2 = this.timeService.getPredate(utcTime, 10);
      let localTime2 = this.timeService.getprasedDateAndTime(utcTime2, timezone);
      this.hour_range1 = localTime2.hour;
      this.min_range1 = localTime2.minute;
      this.sec_range1 = localTime2.second;
      this.merdian_range1 = localTime2.meridiem;

      this.hour_range2 = localTime.hour;
      this.min_range2 = localTime.minute;
      this.sec_range2 = localTime.second;
      this.merdian_range2 = localTime.meridiem;
      this.startDate.hour = this.hour;
      this.startDate.minute = this.min;
      this.startDate.second = this.sec;
      this.startDate.meridiem = this.merdian;
      this.hour = localTime.hour;
      this.min = localTime.minute;
      this.sec = localTime.second;
      this.merdian = localTime.meridiem;
    }
    this.restoreFromStorage();
 }

 
  
  /**
   * Gets the shift values from server and loads
   * 
   * 
   * 
   * @memberOf PlayerCalendarComponent
   */
   intializeShift() {
    let that = this;
    this.timeService.getShifts().subscribe((shifts) => {
      that.shift = shifts;
    });
  }



  /**
  * Set mode when shift is selected 
  * 
  * 
  * 
  * @memberOf PlayerCalendarComponent
  */
  shiftChange() {
    this.mode = '2';
  }


 /**
  *Hides the player calender dialogue without retaining the changed value 
  * 
  * 
  * 
  * @memberOf PlayerCalendarComponent
  */
  onCancelClick() {
    let playerData = new PlayerData();
    playerData.isDoneClicked = false;
    this.buttonClicked.emit(playerData);
  }




 /**
  *Set the date when calender date is selected  
  * 
  * 
  * @param {*} event
  * 
  * @memberOf PlayerCalendarComponent
  */
  onDateRangeChanged(event: any) {
    this.actionService.PopupHidden=true;
    let beginDate = event.beginDate;
    this.startDate.day = beginDate.day;
    this.startDate.month = beginDate.month;
    this.startDate.year = beginDate.year;
    if (event.formatted !== '') {
      this.selectedTextNormal = event.formatted;
      this.selectedDateRangeNormal = event.formatted;
    }
    else {
      this.selectedTextNormal = '';
    }
  }


 /**
  *Set the start and end time when range is selected  
  * 
  * 
  * 
  * @memberOf PlayerCalendarComponent
  */
  rangeTimeCalculation() {

   if ((this.hour_range1 == this.hour_range2) && (this.min_range1 == this.min_range2) && (this.sec_range1 == this.sec_range2) && (this.merdian_range1 == this.merdian_range2)) {
     this.startDate.hour = this.hour_range1;
     this.startDate.minute = this.min_range1;
     this.startDate.second = this.sec_range1;
     this.startDate.meridiem = this.merdian_range1;
     this.beginDateString = this.timeService.convertLocalTimeToUtc(this.startDate, this.src.timezone);
     this.playernotifydata.starttime = this.timeService.getPredate(this.beginDateString, 10);
     this.playernotifydata.endtime = this.timeService.getPostDate(this.beginDateString, 10);
   }


   else {
     this.startDate.hour = this.hour_range1;
     this.startDate.minute = this.min_range1;
     this.startDate.second = this.sec_range1;
     this.startDate.meridiem = this.merdian_range1;
     this.beginDateString = this.timeService.convertLocalTimeToUtc(this.startDate, this.src.timezone);
     this.startDate.hour = this.hour_range2;
     this.startDate.minute = this.min_range2;
     this.startDate.second = this.sec_range2;
     this.startDate.meridiem = this.merdian_range2;
     this.endDateString = this.timeService.convertLocalTimeToUtc(this.startDate, this.src.timezone);
     if (this.timeService.isStartTimeExceedEndTime(this.beginDateString, this.endDateString)) {
       this.endDateString = this.timeService.addDays(this.endDateString, 1);
     }
     this.playernotifydata.starttime = this.beginDateString;
     this.playernotifydata.endtime = this.endDateString;
     this.playerService.setPlayerTitleDate(this.beginDateString, this.endDateString);
   }
 }
 


/**
 * Hides the player calender dialogue by retaining the changed value 
 * 
 * 
 * 
 * @memberOf PlayerCalendarComponent
 */
 onDoneClick() {

    this.playerDateselected = true;
    let playerData = new PlayerData();
    playerData.Date = "";
    playerData.isDoneClicked = true;
    this.buttonClicked.emit(playerData);
    this.src = this.videoService.getSelectedVideoSource();

    if (this.mode == '0') {
      this.startDate.hour = this.hour;
      this.startDate.minute = this.min;
      this.startDate.second = this.sec;
      this.startDate.meridiem = this.merdian;

      this.beginDateString = this.timeService.convertLocalTimeToUtc(this.startDate, this.src.timezone);

      this.playernotifydata.starttime = this.timeService.getPredate(this.beginDateString, 10);
      this.playernotifydata.endtime = this.timeService.getPostDate(this.beginDateString, 10);
    }
    if (this.mode == '1') {
      this.rangeTimeCalculation();
    }
    if (this.mode == '2') {
      this.shift.forEach(shiftval => {
        if (shiftval.name == this.selectedShift) {
          this.beginDateString = shiftval.start_time;

          this.endDateString = shiftval.end_time;
        }
      })
     
      this.shiftDate = this.startDate.year + "-" + this.startDate.month + "-" + this.startDate.day;
      let begin=this.timeService.convertShiftLocalTImetoUtc(this.shiftDate, this.beginDateString, this.src.timezone);
      let end=this.timeService.convertShiftLocalTImetoUtc(this.shiftDate, this.endDateString, this.src.timezone);
      if(this.timeService.isStartTimeEqualOrExceedEndTime(begin,end)){
         end = this.timeService.addDays(end, 1);
      }
      this.playernotifydata.starttime = begin;
      this.playernotifydata.endtime = end;

    }
   this.actionBarCommunicationService.notifyPlayer(this.playernotifydata);
   this.saveToStorage();

  }


/**
 * Set the mode when exact time is selected 
 * 
 * 
 * 
 * @memberOf PlayerCalendarComponent
 */
 exactTimeChange() {
  this.mode = '0';
}


/**
 * Set the mode when range is selected 
 * 
 * 
 * 
 * @memberOf PlayerCalendarComponent
 */
 rangeTimeChange() {

  this.mode = '1';
}

/**
   * Validate the hour ,minute and second field
   * 
   * @private
   * @param {number} hour
   * @param {number} min
   * @param {number} sec
   * 
   * @memberOf PlayerCalendarComponent
   */
 TimeChange(hour: number, min: number, sec: number) {
    if (this.min == 59) {
      if (this.hour < 12) {
        this.hour++;
        this.min = 0;
      }
    }
    if (this.sec == 59) {
      if (this.min < 59) {
        this.min++;
        this.sec = 0;
      }
      else {
        if (this.min == 59) {
          if (this.hour < 12) {
            this.hour++;
            this.min = 0;
            this.sec = 0;
          }
        }
      }
    }
  }


/**
 * Store  value in session
 * 
 * 
 * 
 * @memberOf PlayerCalendarComponent
 */
  saveToStorage() {

    this.calObj.mode = this.mode;
    this.calObj.hour = this.hour;
    this.calObj.min = this.min;
    this.calObj.sec = this.sec;
    this.calObj.merdian = this.merdian;
   
    this.calObj.hour_range1 = this.hour_range1;
    this.calObj.min_range1 = this.min_range1;
    this.calObj.sec_range1 = this.sec_range1;
    this.calObj.merdian_range1 = this.merdian_range1;
    this.calObj.hour_range2 = this.hour_range2;
    this.calObj.min_range2 = this.min_range2;
    this.calObj.sec_range2 = this.sec_range2;
    this.calObj.merdian_range2 = this.merdian_range2;

    this.calObj.day = this.startDate.day;
    this.calObj.month = this.startDate.month;
    this.calObj.year = this.startDate.year;

    this.calObj.selectedShift = this.selectedShift;
    this.calObj.selectedDateRangeNormal = this.selectedDateRangeNormal;
    this.storageService.write("playerCalender", JSON.stringify(this.calObj));
  }

/**
  * Retrives  value from session
  * 
  * 
  * 
  * @memberOf PlayerCalendarComponent
  */
 restoreFromStorage() {

    let calStr: any = this.storageService.read("playerCalender");

    if (calStr != null && calStr != 'undefined') {
      this.calObj = JSON.parse(calStr);
      if (this.calObj != null) {
        this.mode = this.calObj.mode;

        this.hour = this.calObj.hour;
        this.min = this.calObj.min;
        this.sec = this.calObj.sec;
        this.merdian = this.calObj.merdian;

        this.hour_range1 = this.calObj.hour_range1;
        this.min_range1 = this.calObj.min_range1;
        this.sec_range1 = this.calObj.sec_range1;
        this.merdian_range1 = this.calObj.merdian_range1;

        this.hour_range2 = this.calObj.hour_range2;
        this.min_range2 = this.calObj.min_range2;
        this.sec_range2 = this.calObj.sec_range2;
        this.merdian_range2 = this.calObj.merdian_range2;

        this.startDate.day = this.calObj.day;
        this.startDate.month = this.calObj.month;
        this.startDate.year = this.calObj.year;

        this.selectedShift = this.calObj.selectedShift;
        this.selectedDateRangeNormal = this.calObj.selectedDateRangeNormal;
      }
    }
  }

 
  
  /**
   * When Up and down key is moved in keyboard
   * 
   * @param {any} e
   * @returns false
   * 
   * @memberOf PlayerCalendarComponent
   */
   onkeydown(e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58)
      || e.keyCode == 8)) {
      return false;
    }
  }

}