/**********************************************************************************
* File Name   :   VideoService.ts
* Description :   This class implements API client interface for Video , which enables 
*                 the Video components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 10-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Observable } from 'rxjs/Rx';
import { TimeService } from './time.service';
import { CookieService } from './cookie.service';
import { HeatmapService } from './heatmap.service';
import { LibraryService } from './library.service';
import { Data } from '@angular/router';
import { FakecameraService } from './fakecamera.service';
import { Injectable } from '@angular/core';
import { ApiBuilder } from './../utilities/api-builder';
import { Http } from '@angular/http';
import { Camera } from './../model/camera';
//import * as moment from './../../../node_modules/moment/moment';
import * as moment from './../../../node_modules/moment-timezone/moment-timezone';
import { StorageService } from './storage.sevice';
import { DateFormat } from './../model/date-format';

@Injectable()
export class VideoService {
  private api: any;
  private DEVICE_API = "api/devices/";
  private HIGH_RESOLUTION = "/thumbnail?width=384&height=216&qmin=8&qmax=8";
  private POSTER_RESOLUTION = "/thumbnail?width=1280&height=720&qmin=8&qmax=8&refresh="
  //private POSTER_RESOLUTION = "/thumbnail?width=384&height=216&qmin=8&qmax=8&refresh="
  private timeZoneJson;
  private selectedVideoSource;
  private apiBuilder;
  private heatmapGenericUrl;
  private videoDatesObj;

  /**
   * Creates an instance of VideoService.
   * @param {Http} http 
   * @param {HeatmapService} heatmapService 
   * @param {CookieService} cookieService 
   * @param {TimeService} timeService 
   * @param {LibraryService} libraryService 
   * @param {StorageService} storageService 
   * 
   * @memberOf VideoService
   */
  constructor(private http: Http, private heatmapService: HeatmapService,
    private cookieService: CookieService,
    private timeService: TimeService,
    private libraryService: LibraryService,
    private storageService: StorageService
  ) {
    this.heatmapService.restoreFromStorage();
    this.api = ApiBuilder.getInstance();
    this.apiBuilder = this.api;
    //Loading Timezone info from asset, file retrived from momet module
    http.get('./../../assets/latest.json')
      .map(res => res.json())
      .subscribe(data => {
        this.timeZoneJson = data,
          // Loading timezone JSON to moment
          moment.tz.load(this.timeZoneJson);
        heatmapService.setCalendarData(this.heatmapService.heatMapFromDate, this.heatmapService.heatMapToDate);
      },
      err => console.log(err),
      () => console.log('Completed'));
  }

  /**
   * CHECK
   * 
   * @param {any} url 
   * @returns 
   * 
   * @memberOf VideoService
   */
  tryLoadingImage(url) {
    return this.http.get(url);
  }

  /**
   * Get camera details for given VIEW 
   * 
   * @param {string} viewID 
   * @param {string} [requestTime='now'] 
   * @returns 
   * 
   * @memberOf VideoService
   */
  getViewCamaras(viewID: string, requestTime = 'now') {
    if (viewID == null) {
      return null;
    }
    let that = this;
    let viewCamerafinalURL = this.api.getViewCameraListURL().replace("VIEW_ID", viewID);

    return this.http
      .get(viewCamerafinalURL, {})
      .map(response => {
        this.heatmapService.heatmapOn = this.cookieService.getCookieHeatmapOn();
        let heatmapOn = this.heatmapService.heatmapOn;
        let rangeSelected = this.heatmapService.isDateRangeSelected
        let viewCameraList = new Array<Camera>();
        let res = response.json();
        let reponseStatus = response.status;
        if (reponseStatus == 200) {
          let dev = res.data.devices;
          for (let i = 0; i < dev.length; i++) {
            let camera = new Camera();
            camera.id = dev[i].id;
            camera.name = dev[i].name;
            camera.uid = dev[i].uid;
            if (dev[i].assigned_gateway) {
              camera.status = dev[i].assigned_gateway.online;
              camera.timezone = dev[i].assigned_gateway.timezone;
              camera.isOnline = dev[i].assigned_gateway.online && dev[i].healthy;
              camera.gatewayIp = dev[i].assigned_gateway.ipv4;
              camera.uploadKbps = dev[i].assigned_gateway.upload_kbps;
            }
            if (dev[i].assigned_gateway.site) {
              camera.storeName = dev[i].assigned_gateway.site.name;
            }
            camera.storeName = dev[i].site == null ? '' : dev[i].site.name;

            if (!heatmapOn) {
              if (requestTime == "now") {
                camera.thumbnailUrl = that.DEVICE_API + camera.uid + that.HIGH_RESOLUTION;
                camera.posterUrl = that.DEVICE_API + camera.uid + that.POSTER_RESOLUTION+Date.now();
              } else {
                camera.thumbnailUrl = "api/devices/DEVICE_UID/thumbnail?time=RFCTIME&width=324&height=180&qmin=8&qmax=8";
                camera.thumbnailUrl = camera.thumbnailUrl.replace("DEVICE_UID", camera.uid);
                camera.thumbnailUrl = camera.thumbnailUrl.replace("RFCTIME", requestTime);
                camera.posterUrl = "api/devices/DEVICE_UID/thumbnail?time=RFCTIME&width=1280&height=720&qmin=8&qmax=8";
                camera.posterUrl = camera.posterUrl.replace("DEVICE_UID", camera.uid);
                camera.posterUrl = camera.posterUrl.replace("RFCTIME", requestTime);
              }
              //get heatmap image if hetamap is ON
            } else {
              //if User selcted any date range use it, else use defult range
              if (rangeSelected) {
                camera.thumbnailUrl = this.heatmapService.getHeatMapUrlforSelectedRange(camera.uid, camera.timezone);
              } else {
                camera.thumbnailUrl = this.heatmapService.getDefaultHeatMapUrl(camera.uid, camera.timezone);
              }
            }
            camera.thumbnailUrlOld = camera.thumbnailUrl;
            if (requestTime == "now") {
              let time = camera.timezone == null ? null : moment.utc().format();
            } else {
              let time = camera.timezone == null ? null : requestTime;
            }
            let formatedTime = this.getCurrentTime(camera.timezone);
            if (requestTime == "now") {
              camera.description = camera.storeName + '(' + formatedTime + ')';
            } else {
              camera.description = camera.storeName + '(' + this.timeService.getLocalTimeFrame(requestTime, camera.timezone) + ')';
            }
            this.heatmapService.selectedStoreZone = camera.timezone;
            viewCameraList.push(camera);
          }
          return viewCameraList;
        }

      });
  }

  /**
  * Return Camera List for the Store based in Store ID
  * 
  * @param storeID   : store ID
  * @return storeCameraList : Camera List fro Store
  */
  getStoreCameras(storeID: string, requestTime = 'now') {
    if (storeID == null) {
      return null;
    }
    this.timeService.getCurrentUTCTime();
    var storeCameraList = new Array<Camera>();
    let that = this;
    let newUrl = this.api.getStoreCameraListURL().replace("SITE_ID", storeID);

    return this.http
      .get(newUrl, {})
      .map(response => {
        this.heatmapService.heatmapOn = this.cookieService.getCookieHeatmapOn();
        let heatmapOn = this.heatmapService.heatmapOn;
        let rangeSelected = this.heatmapService.isDateRangeSelected;
        var storeCameraList = new Array<Camera>();
        //return response;
        let res = response.json();
        let reponseStatus = response.status;
        if (reponseStatus == 200) {
          let dev = res.data.devices;
          for (let i = 0; i < dev.length; i++) {
            var camera = new Camera();
            camera.id = dev[i].id;
            camera.name = dev[i].name;
            camera.uid = dev[i].uid;
            if (dev[i].assigned_gateway) {
              camera.timezone = dev[i].assigned_gateway.timezone;
              camera.isOnline = dev[i].assigned_gateway.online && dev[i].healthy;
              camera.timezone = dev[i].assigned_gateway.timezone;
              camera.gatewayIp = dev[i].assigned_gateway.ipv4;
              camera.uploadKbps = dev[i].assigned_gateway.upload_kbps;
            }
            if (dev[i].assigned_gateway.site) {
              camera.storeName = dev[i].assigned_gateway.site.name;
            }
            //camera.thumbnailUrlOld = camera.thumbnailUrl;

            // camera.status= dev[i].assigned_gateway.online;
            //Set heatmap thumbnail if heatmap button is ON
            if (!heatmapOn) {
              if (requestTime == 'now') {
                camera.thumbnailUrl = that.DEVICE_API + camera.uid + that.HIGH_RESOLUTION;
                camera.posterUrl = that.DEVICE_API + camera.uid + that.POSTER_RESOLUTION+Date.now();
              } else {
                camera.thumbnailUrl = "api/devices/DEVICE_UID/thumbnail?time=RFCTIME&width=324&height=180&qmin=8&qmax=8";
                camera.thumbnailUrl = camera.thumbnailUrl.replace("DEVICE_UID", camera.uid);
                camera.thumbnailUrl = camera.thumbnailUrl.replace("RFCTIME", requestTime);
                camera.posterUrl = "api/devices/DEVICE_UID/thumbnail?time=RFCTIME&width=1280&height=720&qmin=8&qmax=8";
                camera.posterUrl = camera.posterUrl.replace("DEVICE_UID", camera.uid);
                camera.posterUrl = camera.posterUrl.replace("RFCTIME", requestTime);
              }
            } else {
              if (rangeSelected) {
                camera.thumbnailUrl = this.heatmapService.getHeatMapUrlforSelectedRange(camera.uid, camera.timezone);
              } else {
                camera.thumbnailUrl = this.heatmapService.getDefaultHeatMapUrl(camera.uid, camera.timezone);
              }

            }
            camera.thumbnailUrlOld = camera.thumbnailUrl;
            let formatedTime = this.getCurrentTime(camera.timezone);
            if (requestTime == "now") {
              camera.description = camera.storeName + '(' + formatedTime + ')';
            } else {
              camera.description = camera.storeName + '(' + this.timeService.getLocalTimeFrame(requestTime, camera.timezone) + ')';
            }
            let utcTime = this.timeService.getCurrentUTCTime()
            let pretime = this.timeService.getPredate(utcTime, 30);
            let posttime = this.timeService.getPostDate(utcTime, 30);
            this.heatmapService.selectedStoreZone = camera.timezone;
            storeCameraList.push(camera);
          }
          if (storeCameraList.length == 0) {
            return [];
          }
          return storeCameraList;
        }

      });
  }

  /**
   * Get current Time fo given timezone in hh:mm:ss A z format
   * 
   * @param {string} camTimeZone 
   * @returns 
   * 
   * @memberOf VideoService
   */
  getCurrentTime(camTimeZone: string) {
    if (camTimeZone == null) {
      return null;
    }
    let t = moment().tz(camTimeZone);
    let tt = t == null ? null : t.format('hh:mm:ss A z');
    return tt;

  }

  /**
   * Get Selected Video Source 
   * 
   * @returns 
   * 
   * @memberOf VideoService
   */
  getSelectedVideoSource() {
    return this.selectedVideoSource;
  }

  /**
   * Set Selected Video Source 
   * 
   * @param {any} selectedVideoSource 
   * 
   * @memberOf VideoService
   */
  setSelectedVideoSource(selectedVideoSource) {
    this.selectedVideoSource = selectedVideoSource;
  }

  /**
   * Get Time difference 
   * 
   * @param {any} start 
   * @param {any} end 
   * @returns 
   * 
   * @memberOf VideoService
   */
  getTimediff(start, end) {
    return moment(end).diff(start, 'seconds');
  }

  /**
   * Mark start and End date 
   * 
   * @param {any} startDate 
   * @param {any} endDate 
   * 
   * @memberOf VideoService
   */
  markDates(startDate, endDate) {
    if (this.videoDatesObj == null || this.videoDatesObj === 'undefined') {
      this.videoDatesObj = {};
    }
    this.videoDatesObj.startDate = startDate;
    this.videoDatesObj.endDate = endDate;

  }

  /**
   * Get Marked Date
   * 
   * @returns 
   * 
   * @memberOf VideoService
   */
  getMarkedDates() {
    return this.videoDatesObj;
  }

  /**
   * Clear Marked date
   * 
   * 
   * @memberOf VideoService
   */
  clearMarkedDates() {
    this.videoDatesObj = null;
  }
}
