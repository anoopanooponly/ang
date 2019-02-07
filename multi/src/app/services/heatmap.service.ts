/**********************************************************************************
* File Name   :   HeatmapService.ts
* Description :   This class implements API client interface for Heatmap, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 20-Dec-2016      QuEST Team          Initial version created
**********************************************************************************/
import { StorageService } from './storage.sevice';
import { DateFormat } from './../model/date-format';
import { Camera } from './../model/camera';
import { Router } from '@angular/router';
import { CookieService } from './cookie.service';
import { Injectable } from '@angular/core';
import { ApiBuilder } from './../utilities/api-builder';
import { TimeService } from './time.service';
@Injectable()
export class HeatmapService {
	private calObj = {
		selectedDateRangeNormal: '',
		selectedDateRangeNormalA: '',
		selectedDateRangeNormalB: '',
		heatMapSelectedFromDate: new DateFormat(),
		heatMapSelectedToDate: new DateFormat(),
		isDateRangeSelected: false,
	};
	public heatmapLargeObj =
	{
		heatMapLargeFromDate: new DateFormat(),
		heatMapLargeToDate: new DateFormat(),
		selectedDateRangeLarge: ''
	};

	private apiBuilder;
	private heatmapGenericUrl;
	public heatmapOn: boolean = false;

	public heatMapFromDate: DateFormat;
	public heatMapToDate: DateFormat;
	public heatMapAFromDate: DateFormat;
	public heatMapAToDate: DateFormat;
	public heatMapBFromDate: DateFormat;
	public heatMapBToDate: DateFormat;
	public heatMapLargeFromDate: DateFormat;
	public heatMapLargeToDate: DateFormat;

	private duration: number;
	private halfDuration: number;
	private imageStartTime: string;

	public heatmapComparisonCamera: Camera;
	public heatmapComparisonCameraId: string;
	public comparisonWindowOpen: boolean;
	public singleCameraView: boolean;
	public comparisonSelectedCameraName: string;

	public selectedStoreZone: string;
	public selectedDateRangeInCalendar: string;
	public selectedDateRangeInGallery: string;
	public selectedDateRange: string;
	public selectedDateRangeA: string;
	public selectedDateRangeB: string;
	public selectedDateRangeLarge: string;
	public comparisonLargeUrl: string;

	public selectedDateRangeNormal: string;//Calendar  Date Range
	public selectedDateRangeNormalA: string;
	public selectedDateRangeNormalB: string;
	public singleCamRangeForCalendar: string;

	public calendarPopupOn: boolean;
	public isDateRangeSelected: boolean;
	public isDateRangeSelectedForA: boolean;
	public isDateRangeSelectedForB: boolean;
	public isDateRangeSelectedForLarge: boolean;

	/**
	 * Creates an instance of HeatmapService.
	 * @param {TimeService} timeService 
	 * @param {CookieService} cookieService 
	 * @param {StorageService} storageService 
	 * 
	 * @memberOf HeatmapService
	 */
	constructor(private timeService: TimeService,
		private cookieService: CookieService,
		private storageService: StorageService
	) {
		var api = ApiBuilder.getInstance();
		this.apiBuilder = api;
		this.isDateRangeSelected = false;
		this.heatmapGenericUrl = api.getHeatMapGenericUrl();
		this.comparisonWindowOpen = false;
		this.selectedDateRangeInGallery = this.selectedDateRange;
	}

	/**
	 * Get HeatMap URL for selected Range, heatMapFromDate and heatMapToDateRange 
	 * shall be set before calling this function 
	 * 
	 * @param {string} cameraUid 
	 * @param {string} timeZone 
	 * @param {string} [resolution='width=384&height=216'] 
	 * @returns 
	 * 
	 * @memberOf HeatmapService
	 */
	getHeatMapUrlforSelectedRange(cameraUid: string, timeZone: string, resolution: string = 'width=384&height=216') {

		var api = ApiBuilder.getInstance();
		this.apiBuilder = api;
		this.heatmapGenericUrl = api.getHeatMapGenericUrl();
		let dFrom = this.timeService.getDateFormatted3(this.heatMapFromDate);
		let dTo = this.timeService.getDateFormatted3(this.heatMapToDate);
		let duration = this.timeService.getHeatMapDuration(dFrom, dTo);
		duration = duration + 1;
		let hDuration: number = duration / 2;
		let halfDuration = Math.floor(hDuration);
		let imageStartTime = this.timeService.addtDates(dFrom, halfDuration);
		let thumbnailTime = this.timeService.convertDateToUtc("end", dTo, timeZone);
		let fromDate = this.timeService.convertDateToUtc("start", dFrom, timeZone);

		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DEVICE_ID", cameraUid);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("START_TIME", fromDate);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DURATION_TYPE", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("MOTION_TYPE", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DURATION_TIME", duration);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("THUMB_NAIL_TIME", thumbnailTime);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("RESOLUTION", resolution);

		return this.heatmapGenericUrl;

	}

	/**
	 *Get HeatMap URL for given start time and end time   
	 * 
	 * @param {string} cameraUid 
	 * @param {string} startDate 
	 * @param {string} endDate 
	 * @param {string} [resolution='width=384&height=216'] 
	 * @returns 
	 * 
	 * @memberOf HeatmapService
	 */

	getHeatMapSelectedRangeUrl(cameraUid: string, startDate: string,
		endDate: string, resolution: string = 'width=384&height=216') {

		let LOW_RESOLUTION = "width=384&height=216";
		var api = ApiBuilder.getInstance();
		this.apiBuilder = api;
		this.heatmapGenericUrl = api.getHeatMapGenericUrl();
		let duration = this.timeService.getHeatMapDuration(startDate, endDate);
		duration = duration + 1;
		let hDuration: number = duration / 2;
		let halfDuration = Math.floor(hDuration);
		let imageStartTime = this.timeService.addtDates(startDate, halfDuration);
		let thumbnailTime = this.timeService.convertDateToUtc("end", endDate, this.selectedStoreZone);
		let fromDate = this.timeService.convertDateToUtc("start", startDate, this.selectedStoreZone);

		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DEVICE_ID", cameraUid);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("START_TIME", fromDate);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DURATION_TYPE", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("MOTION_TYPE", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DURATION_TIME", duration);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("THUMB_NAIL_TIME", thumbnailTime);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("RESOLUTION", resolution);

		return this.heatmapGenericUrl;
	}

	/**
	 * Get default HeatMap  URL for Rightside comparison screen 
	 * 
	 * @param {any} cameraUid 
	 * @param {string} timeZone 
	 * @param {string} [resolution='width=384&height=216'] 
	 * @returns 
	 * 
	 * @memberOf HeatmapService
	 */
	getDefaultHeatMapUrl(cameraUid, timeZone: string, resolution: string = 'width=384&height=216') {
		let startTime = this.timeService.getHeatMapDeafultStartTime(timeZone);
		let imageStartTime = this.timeService.getHeatMapDeafultThumbNailTime(timeZone);
		var api = ApiBuilder.getInstance();
		this.apiBuilder = api;
		this.heatmapGenericUrl = api.getHeatMapGenericUrl();
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DEVICE_ID", cameraUid);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("START_TIME", startTime);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DURATION_TYPE", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("MOTION_TYPE", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("DURATION_TIME", "1");
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("THUMB_NAIL_TIME", imageStartTime);
		this.heatmapGenericUrl = this.heatmapGenericUrl.replace("RESOLUTION", resolution);

		return this.heatmapGenericUrl;
	}

	/**
	 * Set the Calender Data for heatmap  
	 * 2016-11-30 format 
	 * @param {DateFormat} startDate 
	 * @param {DateFormat} endDate 
	 * 
	 * @memberOf HeatmapService
	 */
	setCalendarData(startDate: DateFormat, endDate: DateFormat) {
		if (startDate != undefined && endDate != undefined) {
			this.heatMapFromDate = startDate;
			this.heatMapToDate = endDate;
			let dFrom = this.timeService.getDateFormatted3(this.heatMapFromDate)
			let dTo = this.timeService.getDateFormatted3(this.heatMapToDate)
			this.duration = this.timeService.getHeatMapDuration(dFrom, dTo);
			let hDuration: number = this.duration / 2;
			let halfDuration = Math.floor(hDuration);
			this.imageStartTime = this.timeService.getHeatMapImageStartTime(dFrom, halfDuration);
		}
		else {
			this.setDefaultDateRanges();
		}
	}
	//CHECK IF THIS USE
	/**
	 * Called on first loading..
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	setDefaultRangeGalleryOnly() {

		if (this.heatMapFromDate == null) {
			let currentDate = this.timeService.getServerPreviousDate(this.selectedStoreZone);
			let df = this.getDate(currentDate.day, currentDate.month, currentDate.year);
			let range = this.getRange(df, df);
			this.selectedDateRange = range;
			this.selectedDateRangeInGallery = range;
			this.setDateRangeB(currentDate, currentDate);

		}
		else {
			this.setDateRangeB(this.heatMapFromDate, this.heatMapToDate);
		}

	}
	//CHECK IF THIS USE
	/**
	 * This method is called when Heatmap On button is clicked
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	setDefaultDateRanges() {
		//Find default yesterday. Same date for fromDate and toDate
		let currentDate = this.timeService.getServerPreviousDate(this.selectedStoreZone);
		this.setDateRange(currentDate, currentDate);
	}
    //CHECK IF THIS USE
	/**
	 * 
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * 
	 * @memberOf HeatmapService
	 */
	setFDateRange(dateFrom: DateFormat, dateTo: DateFormat) {
		let df = this.getDate(dateFrom.day, dateFrom.month, dateFrom.year);
		let dt = this.getDate(dateTo.day, dateTo.month, dateTo.year);
		this.setDateRange(df, dt);
	}

	/**
	 * 1. called when calendar date (gallery calendar) is changed and done button is clicked
	 * 2. parameters dateFrom and dateTo should be passed as the objects of 'DateFormat' (custom class)
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * 
	 * @memberOf HeatmapService
	 */
	setDateRange(dateFrom: DateFormat, dateTo: DateFormat) {

		//1. Set selectedDateRange
		//2. Set selectedDateRangeB
		//3. Set selectedDateRangeA => 7 days back
		this.heatMapFromDate = dateFrom;
		this.heatMapBFromDate = dateFrom;
		this.heatMapToDate = dateTo;
		this.heatMapBToDate = dateTo;
		let range = this.getRange(dateFrom, dateTo);
		this.selectedDateRange = range;
		this.selectedDateRangeInGallery = range;
		this.selectedDateRangeB = range;

		this.setDateRangeA_WithB(dateFrom, dateTo);
	}

	/**
	 *  called when calendar date (heatmapB calendar) is changed and done button is clicked
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * 
	 * @memberOf HeatmapService
	 */
	setDateRangeB(dateFrom: DateFormat, dateTo: DateFormat) {
		if (dateFrom == undefined) {
			dateFrom = this.timeService.getServerPreviousDate(this.selectedStoreZone);
			dateTo = dateFrom;
		}
		this.heatMapBFromDate = dateFrom;
		this.heatMapBToDate = dateTo;

		let range = this.getRange(dateFrom, dateTo);
		this.selectedDateRangeB = range;
		this.selectedDateRangeNormalB = range;

		if (!this.isDateRangeSelectedForA) {
			this.setDateRangeA_WithB(dateFrom, dateTo);
		}
		else {
			this.selectedDateRangeNormalA = this.selectedDateRangeA;
		}
	}

	/**
	 * 1. called when heatmap comparison screen is loaded. haetmapB range will be same as the selected camera date range
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	setDefaultDateForComparison() {
		if (!this.isDateRangeSelectedForA && !this.isDateRangeSelectedForB) {
			let dateFrom = this.heatMapFromDate;
			let dateTo = this.heatMapToDate;
			if (dateFrom == undefined) {
				dateFrom = this.timeService.getServerPreviousDate(this.selectedStoreZone);
				dateTo = dateFrom;
			}
			this.setDateRangeB(dateFrom, dateTo);
		}
		if (!this.isDateRangeSelectedForA && this.isDateRangeSelectedForB) {
			let dateFrom = this.heatMapBFromDate;
			let dateTo = this.heatMapBToDate;
			if (dateFrom == undefined) {
				dateFrom = this.timeService.getServerPreviousDate(this.selectedStoreZone);
				dateTo = dateFrom;
			}
			this.setDateRangeB(dateFrom, dateTo);
		}
		else if (!this.isDateRangeSelectedForA && this.isDateRangeSelectedForB) {
			let dateFrom = this.heatMapFromDate;
			let dateTo = this.heatMapToDate;
			if (dateFrom == undefined) {
				dateFrom = this.timeService.getServerPreviousDate(this.selectedStoreZone);
				dateTo = dateFrom;
			}
			this.setDateRangeB(dateFrom, dateTo);
		}
	}

	/**
	 * 1. called when calendar date (heatmapA calendar) is changed and done button is clicked
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * 
	 * @memberOf HeatmapService
	 */
	setDateRangeA_WithB(dateFrom: DateFormat, dateTo: DateFormat) {
		let from = this.timeService.addDaysAndResetTime3(dateFrom, -7);
		let to = this.timeService.addDaysAndResetTime3(dateTo, -7);
		this.heatMapAFromDate = from;
		this.heatMapAToDate = to;

		let range = this.getRange(from, to)
		this.selectedDateRangeA = range;
		this.selectedDateRangeNormalA = range;
	}

	/**
	 * called when calendar date (heatmapA calendar) is changed and done button is clicked
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * 
	 * @memberOf HeatmapService
	 */
	setDateRangeA_CalendarClick(dateFrom: DateFormat, dateTo: DateFormat) {
		this.heatMapAFromDate = dateFrom;
		this.heatMapAToDate = dateTo;

		let fromA = this.timeService.getFormattedDate2(dateFrom)
		let toA = this.timeService.getFormattedDate2(dateTo);
		let range = this.getRange(dateFrom, dateTo) //fromA + '  -  ' + toA;
		this.selectedDateRangeA = range;
		this.selectedDateRangeNormalA = range;
	}

	/**
	 * 1. called when calendar date (heatmapA calendar) is changed and done button is clicked
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * 
	 * @memberOf HeatmapService
	 */
	setDateRangeSingleCam(dateFrom: DateFormat, dateTo: DateFormat) {
		// this.heatMapLargeFromDate = dateFrom;
		// this.heatMapLargeToDate = dateTo;
		let range = this.getRange(dateFrom, dateTo);
		this.selectedDateRangeLarge = range;
	}

	/**
	 * 
	 * 
	 * @param {any} day 
	 * @param {any} month 
	 * @param {any} year 
	 * @returns 
	 * 
	 * @memberOf HeatmapService
	 */
	getDate(day, month, year) {
		var d = new DateFormat();
		d.day = day;
		d.month = month;
		d.year = year;
		return d;
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	restoreFromStorage() {
		let calStr: any = this.storageService.read("heatmapCal");

		if (calStr != null && calStr != 'undefined') {
			this.calObj = JSON.parse(calStr);
			if (this.calObj != null) {
				let range = this.calObj.selectedDateRangeNormal;
				this.selectedDateRangeNormal = range;
				if (this.selectedDateRangeNormalA == undefined) {
					this.selectedDateRangeNormalA = this.calObj.selectedDateRangeNormalA;
				}
				if (this.selectedDateRangeNormalB == undefined) {
					this.selectedDateRangeNormalB = this.calObj.selectedDateRangeNormalB;
				}

				this.heatMapFromDate = this.calObj.heatMapSelectedFromDate;
				this.heatMapToDate = this.calObj.heatMapSelectedToDate;
				this.isDateRangeSelected = this.calObj.isDateRangeSelected;
				this.selectedDateRangeInCalendar = range;
				this.selectedDateRangeInGallery = range;
			}
		}
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	saveToStorage() {
		this.calObj.selectedDateRangeNormal = this.selectedDateRangeNormal;
		this.calObj.selectedDateRangeNormalA = this.selectedDateRangeNormalA;
		this.calObj.selectedDateRangeNormalB = this.selectedDateRangeNormalB;
		this.calObj.heatMapSelectedFromDate = this.heatMapFromDate;
		this.calObj.heatMapSelectedToDate = this.heatMapToDate;
		this.calObj.isDateRangeSelected = this.isDateRangeSelected;

		this.storageService.write("heatmapCal", JSON.stringify(this.calObj));
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	clearStorage() {
		this.calObj.selectedDateRangeNormal = undefined;
		this.calObj.selectedDateRangeNormalA = undefined;
		this.calObj.selectedDateRangeNormalB = undefined;
		this.calObj.heatMapSelectedFromDate = undefined;
		this.calObj.heatMapSelectedToDate = undefined;
		this.calObj.isDateRangeSelected = undefined;
		this.calObj.heatMapSelectedFromDate = undefined;
		this.calObj.heatMapSelectedToDate = undefined;

		this.heatMapFromDate = undefined;
		this.heatMapToDate = undefined;
		this.selectedDateRangeNormal = undefined;
		this.selectedDateRange = undefined;
		this.selectedDateRangeInCalendar = undefined;
		this.selectedDateRangeInGallery = undefined;

		this.storageService.write("heatmapCal", JSON.stringify(this.calObj));

		//window.localStorage.clear();
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	clearAll() {
		this.comparisonWindowOpen = false;
		this.singleCameraView = false;
		this.calendarPopupOn = false;

		this.isDateRangeSelected = false;
		this.isDateRangeSelectedForA = false;
		this.isDateRangeSelectedForB = false;
		this.isDateRangeSelectedForLarge = false;
	}

	/**
	 * 
	 * 
	 * @param {*} beginDate 
	 * @param {*} endDate 
	 * @returns {boolean} 
	 * 
	 * @memberOf HeatmapService
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
	 * 
	 * 
	 * @param {DateFormat} dateFrom 
	 * @param {DateFormat} dateTo 
	 * @returns 
	 * 
	 * @memberOf HeatmapService
	 */
	getRange(dateFrom: DateFormat, dateTo: DateFormat) {
		let from = this.timeService.getFormattedDate2(dateFrom);
		let to = this.timeService.getFormattedDate2(dateTo);
		let range: any;
		if (this.isGreaterthanEnddate(dateFrom, dateTo)) {
			range = to + ' - ' + from;
		}
		else {
			range = from + ' - ' + to;
		}

		return range;
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	getHeatmapLargeCookie() {
		if (this.selectedDateRangeLarge == undefined) {
			this.selectedDateRangeLarge = this.cookieService.getCookieHeatmapLargeRange();
			this.singleCamRangeForCalendar = this.selectedDateRangeLarge;
		}
		if (this.heatMapLargeFromDate == undefined) {
			let from = this.cookieService.getCookieHeatmapLargeFromDate();
			this.heatMapLargeFromDate = this.timeService.getDateFromString(from);
		}
		if (this.heatMapLargeToDate == undefined) {
			let to = this.cookieService.getCookieHeatmapLargeToDate();
			this.heatMapLargeToDate = this.timeService.getDateFromString(to);
		}
		if (this.heatmapComparisonCameraId == undefined) {
			this.heatmapComparisonCameraId = this.cookieService.getCookieHeatmapComparisonCameraId();
		}
		if (this.singleCameraView == undefined) {
			this.singleCameraView = this.cookieService.getCookieHeatmapSingleWindowOn();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	setHeatmapLargeCookie() {
		if (this.selectedDateRangeLarge != undefined) {
			this.cookieService.setCookieHeatmapLargeRange(this.selectedDateRangeLarge);
		}
		if (this.heatMapLargeFromDate != undefined) {
			let from = this.timeService.getDateFormatted3(this.heatMapLargeFromDate);
			this.cookieService.setCookieHeatmapLargeFromDate(from);
		}
		if (this.heatMapLargeToDate != undefined) {
			let to = this.timeService.getDateFormatted3(this.heatMapLargeToDate);
			this.cookieService.setCookieHeatmapLargeToDate(to);
		}
		if (this.heatmapComparisonCameraId != undefined) {
			this.cookieService.setCookieHeatmapComparisonCameraId(this.heatmapComparisonCameraId);
		}
		if (this.singleCameraView != undefined) {
			this.cookieService.setCookieHeatmapSingleWindowOn(this.singleCameraView);
		}
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	getComparisonCookie() {
		if (this.heatmapComparisonCameraId == undefined) {
			this.heatmapComparisonCameraId = this.cookieService.getCookieHeatmapComparisonCameraId();
		}
		if (this.heatMapFromDate == undefined) {
			let from = this.cookieService.getCookieHeatmapFromDate();
			this.heatMapFromDate = this.timeService.getDateFromString(from);
		}
		if (this.heatMapToDate == undefined) {
			let to = this.cookieService.getCookieHeatmapToDate();
			this.heatMapToDate = this.timeService.getDateFromString(to);
		}
		if (this.selectedStoreZone == undefined) {
			this.selectedStoreZone = this.cookieService.getCookieStoreZone();
		}
	}

	/**
	 * 
	 * 
	 * 
	 * @memberOf HeatmapService
	 */
	setComparisonCookie() {
		if (this.heatmapComparisonCameraId != undefined) {
			this.cookieService.setCookieHeatmapComparisonCameraId(this.heatmapComparisonCameraId);
		}
		if (this.heatMapFromDate != undefined) {
			let from = this.timeService.getDateFormatted3(this.heatMapFromDate);
			this.cookieService.setCookieHeatmapFromDate(from);
		}
		if (this.heatMapToDate != undefined) {
			let to = this.timeService.getDateFormatted3(this.heatMapToDate);
			this.cookieService.setCookieHeatmapToDate(to);
		}
		if (this.selectedStoreZone != undefined) {
			this.cookieService.setCookieStoreZone(this.selectedStoreZone);
		}
	}

}
