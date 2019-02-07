/**********************************************************************************
* File Name   :   TimeService.ts
* Description :   This class implements handles diffrent time related operations using momnet library, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 20-Dec-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Injectable } from '@angular/core';
import * as moment from './../../../node_modules/moment-timezone/moment-timezone';
import { Http } from '@angular/http';
import { ApiBuilder } from './../utilities/api-builder';
import { Shift } from './../model/shift';
import { DateFormat } from './../model/date-format';

import { Observable } from 'rxjs/Observable';
@Injectable()
export class TimeService {
  private timeforservice: string;
  private timeZoneJson;
  private apiBuilder;
  private shiftList = new Array<Shift>();
  private observableOfShift: Observable<any>;

  /**
   * Creates an instance of TimeService.
   * @param {Http} http 
   * 
   * @memberOf TimeService
   */
  constructor(private http: Http) {
    var api = ApiBuilder.getInstance();
    this.apiBuilder = api;
    this.timeforservice = api.getShiftsAPI();
    http.get('./../../assets/latest.json')
      .map(res => res.json())
      .subscribe(data => {
        this.timeZoneJson = data,
          // Loading timezone JSON to moment
          moment.tz.load(this.timeZoneJson);
      },
      err => console.log(err),
      () => console.log('Completed'));
  }

  /**
   * Get Time Shifts for player
   * 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getShifts() {
    let api = ApiBuilder.getInstance();
    let that = this;
    if (this.shiftList != null && this.shiftList.length > 0) {

      return Observable.of(this.shiftList);
    } else if (this.observableOfShift) {

      return this.observableOfShift;
    } else {
      this.observableOfShift = this.http
        .get(this.timeforservice, {})
        .map(response => {
          //  let shiftList = new Array<any>();
          let res = response.json();
          let shiftvalue = JSON.parse(res.data.value);

          shiftvalue.forEach(shiftval => {
            let shift = new Shift();
            shift.name = shiftval.name;
            shift.start_time = shiftval.start_time;
            shift.end_time = shiftval.end_time;
            this.shiftList.push(shift);
          })
          //  for (let i = 0; i < shiftvalue.length; i++){
          //       let shift =  new Shift();
          //       shift.name=shiftvalue.name;
          //       shift.start_time=shiftvalue.start_time;
          //       shift.end_time=shiftvalue.end_time;
          //     }

          //   shiftList.push(shiftvalue);
          return this.shiftList;
        }).share();
      return this.observableOfShift;
    }
  }

  /**
   * Get current UTC Time
   * 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getCurrentUTCTime() {
    return moment.utc().format();
  }

  /**
   * Get defulalt start time for HeatMap
   * 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getHeatMapDeafultStartTime(timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let localDate = moment.utc().add(-1, 'days').tz(timeZone).format("YYYY-MM-DD");
    localDate = localDate + " 0:00:00";
    return moment.tz(localDate, "YYYY-MM-DD h:mm:ss", timeZone).utc().format();
  }

  /**
   * Get default thumbnail time for HeatMap
   * 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getHeatMapDeafultThumbNailTime(timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let localDate = moment.utc().add(-1, 'days').tz(timeZone).format("YYYY-MM-DD");
    localDate = localDate + " 12:00:00";
    return moment.tz(localDate, "YYYY-MM-DD h:mm:ss", timeZone).utc().format();
  }

  /**
   * Get default heatmap Duration for given start and end date
   * 
   * @param {string} startDate 
   * @param {string} enddate 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getHeatMapDuration(startDate: string, enddate: string) {

    let stDate = moment(startDate, "YYYY-MM-DD");
    let edDate = moment(enddate, "YYYY-MM-DD");

    let dif = (edDate.diff(stDate, 'days'));

    //This will ensure that the duration is always a positive value.
    if (dif < 0) {
      dif = dif * -1;
    }

    return dif;
  }

  /**
   * Get Heatmap  start time for given time
   * 
   * @param {string} startDate 
   * @param {number} halfDuration 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getHeatMapImageStartTime(startDate: string, halfDuration: number) {
    return moment(startDate).utc().add(halfDuration + 1, 'days').hours(12).minutes(0).seconds(0).format();
  }

  /**
   * Add the given days to given date and reset time to zeero
   * 
   * @param {string} startDate : in YYYY-MM-DD format
   * @param {number} days 
   * @returns 
   * 
   * @memberOf TimeService
   */
  addDaysAndResetTime(startDate: string, days: number) {
    return moment(startDate).utc().add(days + 1, 'days').hours(0).minutes(0).seconds(0).format();
  }

  /**
   * Add the given days to given date and return to the format 'MMM DD, YYYY'
   * 
   * @param {DateFormat} startDate 
   * @param {number} days 
   * @returns 
   * 
   * @memberOf TimeService
   */
  addDaysAndResetTime2(startDate: DateFormat, days: number) {
    // return moment(startDate).utc().add(days + 1, 'days').hours(0).minutes(0).seconds(0).format('MMM D, YYYY');
    let date = startDate.year + "-" + startDate.month + "-" + startDate.day;
    let newDate = moment(date, "YYYY-MM-DD").add(days, 'days').format('MMM DD, YYYY');
    return newDate;
  }

  /**
   * Add the given days to given date and return to the format 'YYYY-MM-DD'
   * 
   * @param {DateFormat} inputDate 
   * @param {number} days 
   * @returns 
   * 
   * @memberOf TimeService
   */
  addDaysAndResetTime3(inputDate: DateFormat, days: number) {
    let date = inputDate.year + "-" + inputDate.month + "-" + inputDate.day;
    let newDate = moment(date, "YYYY-MM-DD").add(days, 'days').format('YYYY-MM-DD');
    let retDate = this.getDateFromString(newDate);
    return retDate;
  }

  /**
   * Change the format to 'MMM DD, YYYY'
   * 
   * @param {DateFormat} date 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getFormattedDate2(date: DateFormat) {
    if ((date.year == null) || (date.month == null) || (date.day == null)) {
      return;
    }
    let df = date.year + '-' + date.month + '-' + date.day;
    let d = moment(df, "YYYY-MM-DD").format('MMM DD, YYYY');
    return d;
  }
//CHECK
  /**
   * Get the time in "MMM DD, YYYY" for given time
   * 
   * @param {any} day 
   * @param {any} month 
   * @param {any} year 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateFormatted(day, month, year) {
    let date = year + "-" + month + "-" + day;
    //output== Feb 1, 2017 
    let stDate = moment(date, "YYYY-MM-DD").format("MMM DD, YYYY");
    return stDate;
  }
//CHECK
  /**
   * Get the time in "YYYY-MM-DD" for given time
   * 
   * @param {any} day 
   * @param {any} month 
   * @param {any} year 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateFormatted2(day, month, year) {
    let date = year + "-" + month + "-" + day;
    let stDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
    return stDate;
  }

  /**
   * 
   * 
   * @param {DateFormat} date 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateFormatted3(date: DateFormat) {
    let dateF = date.year + "-" + date.month + "-" + date.day;
    let stDate = moment(dateF, "YYYY-MM-DD").format("YYYY-MM-DD");
    return stDate;
  }

  /**
   * Subract the given minute from given utc time 
   * 
   * @param {string} startDate :utc 
   * @param {*} minutes 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getPredate(startDate: string, minutes: any) {
    return moment.utc(startDate).subtract(minutes, 'minutes').format();
  }
  /**
   * Add the given minute to given utc time 
   * 
   * @param {string} startDate 
   * @param {number} minutes 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getPostDate(startDate: string, minutes: number) {
    return moment.utc(startDate).add(minutes, 'minutes').format();
  }

  /**
   * Add days to givin date and return in the format YYYY-MM-DD"
   * 
   * @param {string} startDate :in "YYYY-MM-DD format 
   * @param {number} days 
   * @returns date in "YYYY-MM-DD format 
   * 
   * @memberOf TimeService
   */
  addtDates(startDate: string, days: number) {
    return moment(startDate, "YYYY-MM-DD").add(days, 'days').format("YYYY-MM-DD");
  }

  /**Add days to givin UTC time"
   * 
   * 
   * @param {string} startDate 
   * @param {number} days 
   * @returns utc time 
   * 
   * @memberOf TimeService
   */
  addDays(startDate: string, days: number) {
    //  return moment(startDate,format).add(days, 'days').format(format);
    return moment(startDate).utc().add(days, 'days');
  }

  /**
   * Get local time in 'MMM-DD-YYYY hh:mm:ss a z' format
   * 
   * @param {string} date in UTC
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getLocalTime(date: string, timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    return moment(date).tz(timeZone).format('MMM-DD-YYYY hh:mm:ss a z');
  }

  /**
   *  Get local time in 'YYYY-MM-DD h:mm:ss A' format
   * 
   * @param {string} date 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getLocal(date: string, timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    return moment.tz(date, timeZone).format('YYYY-MM-DD h:mm:ss A');
  }

  /**
   * Get local time for player in 'dddd, MMM. DD hh:mm:ss A' format
   * 
   * @param {string} date 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getLocalTimeforPlayer(date: string, timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    //return moment(date).tz(timeZone).format('MMM DD hh:mm:ss A z');
    return moment(date).tz(timeZone).format('dddd, MMM. DD hh:mm:ss A');
  }

  /**
   * Get local time of library in 'MMM DD, YYYY,  hh:mm A z' format
   * 
   * @param {string} date 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getLocalTimeforLibrary(date: string, timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    //return moment(date).tz(timeZone).format('MMM DD hh:mm:ss A z');
    return moment(date).tz(timeZone).format('MMM DD, YYYY,  hh:mm A z');
  }

  /**
   * Get local timeframe in 'hh:mm:ss A' format
   * 
   * @param {string} date in UTC
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getLocalTimeFrame(date: string, timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let x = moment.tz(date, timeZone).format('hh:mm:ss A');
    return x;
  }

  /**
   * Get time diff in seonds between given UTC times
   * 
   * @param {String} startTime 
   * @param {String} endTime 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getTimeDifferenceInSeconds(startTime: String, endTime: String) {
    let stDate = moment(startTime);
    let edDate = moment(endTime);
    return (edDate.diff(stDate, 'seconds'));
  }

  /**
   * Get time diff in days  between given UTC times
   * 
   * @param {String} startTime 
   * @param {String} endTime 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getTimeDifferenceInDays(startTime: String, endTime: String) {
    let stDate = moment(startTime);
    let edDate = moment(endTime);
    return (edDate.diff(stDate, 'days'));
  }

  /**
   * check if start time exceed endtime
   * 
   * @param {string} startTime :in UTC 
   * @param {string} endTime :in UTC 
   * @returns 
   * 
   * @memberOf TimeService
   */
  isStartTimeExceedEndTime(startTime: string, endTime: string) {
    if((startTime=="null")||(startTime=="undefined")){
      return false;
    }
     if((endTime=="null")||(endTime=="undefined")){
       return false;
    }
    return moment(startTime).isAfter(endTime);
  }

  /**
   * Convert seconds to "HH:mm:ss" format
   * 
   * @param {*} seconds 
   * @returns time in "HH:mm:ss" format
   * 
   * @memberOf TimeService
   */
  convertSecondsToTimeFormat(seconds: any) {
    let mSeconds = Number(seconds) * 1000;
    return moment.utc(mSeconds).format("HH:mm:ss");

  }

  /**
   * Get today date in DD-MM-YYYY format
   * 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateTodayFormatted() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    return this.getDateFormatted(dd, mm, yyyy);
  }

  /**
   * Get yesterday date in DD-MM-YYYY format
   * 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateYesterdayFormatted(timeZone: string) {

    let yesterday = this.getServerPreviousDate(timeZone)

    var dd = yesterday.day;
    var mm = yesterday.month;
    var yyyy = yesterday.year;
    let formattedDate = this.getDateFormatted(dd, mm, yyyy);
    return formattedDate;
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getYesterDayYear() {
    var yesterday = (function () { this.setDate(this.getDate() - 1); return this }).call(new Date)
    var yyyy = yesterday.getFullYear();
    return yyyy;
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getYesterDayMonth() {
    var yesterday = (function () { this.setDate(this.getDate() - 1); return this }).call(new Date)
    var mm = yesterday.getMonth();
    return mm;
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getYesterDay() {
    var yesterday = (function () { this.setDate(this.getDate() - 1); return this }).call(new Date)
    var dd = yesterday.getMonth();
    return dd;
  }

  /**
   * 
   * 
   * @param {any} month 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getMonth(month) {
    let m = '';
    switch (month) {
      case 1: m = 'Jan'; break;
      case 2: m = 'Feb'; break;
      case 3: m = 'Mar'; break;
      case 4: m = 'Apr'; break;
      case 5: m = 'May'; break;
      case 6: m = 'Jun'; break;
      case 7: m = 'Jul'; break;
      case 8: m = 'Aug'; break;
      case 9: m = 'Sep'; break;
      case 10: m = 'Oct'; break;
      case 11: m = 'Nov'; break;
      case 12: m = 'Dec'; break;
    }

    return m;

  }

  /**
   * Get time diffrence of given time in minutes
   * 
   * @param {string} time1 
   * @param {string} time2 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getTimediffinMinute(time1: string, time2: string) {
    let t = moment(time1).diff(time2, 'minutes');
    return t;
  }

  /**
   * check if given times are equal
   * 
   * @param {string} startTime 
   * @param {string} endTime 
   * @returns 
   * 
   * @memberOf TimeService
   */
  isStartTimeAndEndTimeEqual(startTime: string, endTime: string) {
    return moment(startTime).isSame(endTime);

  }

  /**
   * check if start time equal or exceed end time
   * 
   * @param {string} startTime 
   * @param {string} endTime 
   * @returns 
   * 
   * @memberOf TimeService
   */
  isStartTimeEqualOrExceedEndTime(startTime: string, endTime: string) {
    let isSame = moment(startTime).isSame(endTime);

    if (isSame == false) {
      isSame = this.isStartTimeExceedEndTime(startTime, endTime);
    }
    return isSame;
  }

  /**
   * Get server local date 
   * 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getServerLocalDate(timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let serverDate: Date = new Date();
    serverDate.setDate(moment.utc().format('DD'));
    serverDate.setMonth(moment.utc().format('MM'));
    serverDate.setFullYear(moment.utc().format('YYYY'));
    return serverDate;
  }

  /**
   * Get parsed date and time.
   * 
   * @param {string} utcTime 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getprasedDateAndTime(utcTime: string, timeZone: string) {

    if (utcTime == null) {
      return null;
    }
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let date = new DateFormat();
    date.day = moment(utcTime).tz(timeZone).format('DD');
    date.month = moment(utcTime).tz(timeZone).format('MM');
    date.year = moment(utcTime).tz(timeZone).format('YYYY');
    date.hour = moment(utcTime).tz(timeZone).format('h');
    date.minute = moment(utcTime).tz(timeZone).format('mm');
    date.second = moment(utcTime).tz(timeZone).format('ss');
    date.meridiem = moment(utcTime).tz(timeZone).format('A');

    return date;
  }

  /**
   * Convert local time to UTC time
   * 
   * @param {DateFormat} dateFormat 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  convertLocalTimeToUtc(dateFormat: DateFormat, timeZone: string) {
    if ((dateFormat.year == null) || (dateFormat.month == null) || (dateFormat.day == null) || (dateFormat.hour == null) || (dateFormat.minute == null) || (dateFormat.second == null) || (dateFormat.meridiem) == null) {
      return null;
    }
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }

    let localtime = dateFormat.year + "-" + dateFormat.month + "-" + dateFormat.day + " " + dateFormat.hour + ":" + dateFormat.minute + ":" + dateFormat.second + " " + dateFormat.meridiem;
    //Converting to 24Hr Format
    let timeFormat = moment(localtime, ["YYYY-MM-DD h:mm:ss A"]).format("YYYY-MM-DD HH:mm:ss");
    return moment.tz(localtime, "YYYY-MM-DD h:mm:ss A", timeZone).utc().format();

  }

  /**
   * Get only date in MMM DD, YYYY fromat for given UTC
   * 
   * @param {string} utcTime 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateOnlyfromUtc(utcTime: string, timeZone: string) {
    if (utcTime == null) {
      return null;
    }
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    return moment(utcTime).tz(timeZone).format("MMM DD, YYYY");
  }

  /**
   * Get only date in YYYY-MM-DD fromat for given UTC
   * 
   * @param {string} utcTime 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getdateonlyforpeoplecount(utcTime: string, timeZone: string) {
    if (utcTime == null) {
      return null;
    }
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    return moment(utcTime).tz(timeZone).format("YYYY-MM-DD");
  }

  /**
   * Convert shift time in YYYY-MM-DD h:mm:ss format to UTC 
   * 
   * @param {string} date 
   * @param {string} time 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  convertShiftLocalTImetoUtc(date: string, time: string, timeZone: string) {
    let localtime = date + " " + time;
    let temp = moment.tz(localtime, "YYYY-MM-DD h:mm:ss", timeZone).utc().format();
    return temp;
  }

  /**
   * Get previose date of server time 
   * 
   * @param {string} timeZone 
   * @returns{DateFormat} serverDate
   * 
   * @memberOf TimeService
   */
  getServerPreviousDate(timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let utcTime = moment.utc().format();
    let prevUtcTime = moment.utc(utcTime).subtract(1, 'days').format();
    let serverDate: any = new DateFormat();

    // serverDate.setDate(moment.tz(prevUtcTime, timeZone).format('DD'));
    // serverDate.setMonth(moment.tz(prevUtcTime, timeZone).format('MM'));
    //  serverDate.setFullYear(moment.tz(prevUtcTime, timeZone).format('YYYY'));
    serverDate.day = (moment.tz(prevUtcTime, timeZone).format('DD'));
    serverDate.month = (moment.tz(prevUtcTime, timeZone).format('MM'));
    serverDate.year = (moment.tz(prevUtcTime, timeZone).format('YYYY'));

    return serverDate;
  }

  /**
   * COnvert Given time to UTC
   * 
   * @param {string} type 
   * @param {string} dateFormat 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  convertDateToUtc(type: string, dateFormat: string, timeZone: string) {
    if (dateFormat == null) {
      return null;
    }

    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let localtime;
    if (type == "end") {
      localtime = dateFormat + " 12:00:00";
    } else {
      localtime = dateFormat + " 00:00:00";
    }
    return moment.tz(localtime, "YYYY-MM-DD h:mm:ss", timeZone).utc().format();
  }

  /**
   * Get server Date in "YYYY-MM-DD" format
   * 
   * @param {string} timeZone 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getServerDate(timeZone: string) {
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let utcTime = moment.utc().format();
    return moment.tz(utcTime, timeZone).format("YYYY-MM-DD");
  }

  /**
   * Add milli second to given UTC time
   * 
   * @param {String} utcTime 
   * @param {string} mSec 
   * @param {string} timeZone 
   * @returns time in dddd, MMM. DD hh:mm:ss A" format
   * 
   * @memberOf TimeService
   */
  addMilliSecondsToUtc(utcTime: String, mSec: string, timeZone: string) {
    if (utcTime == null) {
      return null;
    }
    if (timeZone == null || (timeZone == undefined)) {
      timeZone = "US/Pacific";
    }
    let utcNow = moment.utc(utcTime).add(mSec, 'milliseconds').format();
    return moment.tz(utcNow, timeZone).format("dddd, MMM. DD hh:mm:ss A");
  }

  /**
   * Check if Start Date is greater than end date
   * 
   * @param {string} startDate : MMM DD,YYYY format
   * @param {string} endDate :MMM DD,YYYY format
   * @returns 
   * 
   * @memberOf TimeService
   */
  isFormatedStartDateIsGreater(startDate: string, endDate: string) {
    let stDate = moment(startDate, "MMM DD,YYYY").format("YYYY-MM-DD");
    let edDate = moment(endDate, "MMM DD,YYYY").format("YYYY-MM-DD");
    return moment(stDate).isAfter(edDate);
  }

  /**
   * Check if Start Date is greater than end date
   * 
   * @param {string} startDate 
   * @param {string} endDate 
   * @returns 
   * 
   * @memberOf TimeService
   */
  isStartDateIsGreater(startDate: string, endDate: string) {
    return moment(startDate).isAfter(endDate);
  }

  /**
   * check if given date is greater that current time
   * 
   * @param {any} date 
   * @returns 
   * 
   * @memberOf TimeService
   */
  isGreaterThanNow(date) {
    let stDate = this.getCurrentUTCTime();
    return moment(date).isAfter(stDate);
  }

  /**
   * Get Date only form given UTC time
   * 
   * @param {string} utc 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateOnlyFromUTC(utc: string) {
    return moment(utc).format("DD-MMM-YYYY");
  }

  /**
   * get date from UTC in given format 
   * 
   * @param {string} utc 
   * @returns {DateFormat} dateFormat
   * 
   * @memberOf TimeService
   */
  getDateFromUTC(utc: string) {
    let dateFormat = new DateFormat();
    dateFormat.day = moment(utc).format("DD");
    dateFormat.month = moment(utc).format("MM");
    dateFormat.year = moment(utc).format("YYYY");

    return dateFormat;
  }

  /**
   * Get parsed Date and time
   * 
   * @param {string} date 
   * @returns 
   * 
   * @memberOf TimeService
   */
  getDateFromString(date: string) {
    let dateFormat = new DateFormat();
    dateFormat.day = moment(date, "YYYY-MM-DD").format("DD");
    dateFormat.month = moment(date, "YYYY-MM-DD").format("MM");
    dateFormat.year = moment(date, "YYYY-MM-DD").format("YYYY");

    return dateFormat;
  }
}
