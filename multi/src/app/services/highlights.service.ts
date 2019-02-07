/**********************************************************************************
* File Name   :   HighlightsService.ts
* Description :   This class implements API client interface for Highlights, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 20-Dec-2016      QuEST Team          Initial version created
**********************************************************************************/
import { HighlightsTabComponent } from './../highlights/components/highlights-tab/highlights-tab.component';
import { Observable } from 'rxjs/Rx';
import { TimeService } from './time.service';
import { Injectable } from '@angular/core';
import { ApiBuilder } from './../utilities/api-builder';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HighlightRealsData } from './../model/highlight-reals-data';
import { HighlightDataList } from './../model/highlight-data-list';
import { LibCamera } from './../model/lib-camera';
import * as _ from 'lodash';
@Injectable()
export class HighlightsService {

  public downloadBarActive = false;
  public GroupBy;
  public PageName: string;
  public storesHavingCamera: any;
  public reelsHavingCamera: any;
  public loadingSpinnerOn = true;
  public selectedItemCount: number;
  public selectedItemCountStr: string;
  public seeMoreBackButtonOn: boolean;
  public selectedVideoUrls = new Array<string>();
  public selectedHlVideos = new Array<any>();
  public selectedCameras = new Array<any>();
  public SeeMoreFromPageName: string;
  public seeMoreSelected: boolean;
  public selectedStoreId: string;
  public selectedReelId: string;
  public selectedReelName: string;
  public datewiseSeeMoreList = [];
  public dateSelected: string;
  public totalPageCount: number;
  private RET_SUCCESS = 200;
  private DEFAULT_CAM_COUNT = 8;
  private ITEMS_PER_PAGE = 24;
  private highlightDataUrl;
  public highlightDateWiseList = Array<HighlightDataList>();
  public highlightDataList = Array<HighlightDataList>();
  private lastUpdatedPage: number = -1;
  private INFINITE_DATE = "Dec 31,9999";

  /**
   * Creates an instance of HighlightsService.
   * @param {Http} http 
   * @param {TimeService} timeService 
   * 
   * @memberOf HighlightsService
   */
  constructor(private http: Http,
    private timeService: TimeService) {
    this.selectedItemCount = 0;
    this.reelsHavingCamera = new Array<HighlightRealsData>();
  }

  /**
   * Return the list the HighlightReel
   * 
   * @returns 
   * 
   * @memberOf HighlightsService
   */
  getHighlightReelList() {
    let api = ApiBuilder.getInstance();
    this.highlightDataUrl = api.getHighlightsReportRulesGenericURL();
    let that = this;
    return this.http
      .get(this.highlightDataUrl, {})
      .map(response => {
        let higlLightDataList = new Array<HighlightRealsData>();
        let res = response.json();
        let reponseStatus = response.status;
        if (reponseStatus == this.RET_SUCCESS) {
          let reportRules = res.data.report_rules;
          for (let i = 0; i < reportRules.length; i++) {
            let higlLightData = new HighlightRealsData();
            higlLightData.id = reportRules[i].id;
            higlLightData.name = reportRules[i].name;
            higlLightData.startTime = reportRules[i].start_time;
            higlLightData.endTime = reportRules[i].end_time;
            higlLightData.type = reportRules[i].type;
            higlLightDataList.push(higlLightData);
          }
        }
        else {
        }
        return higlLightDataList;
      }
      );//.subscribe(result => console.log('Subscribe'));
  }

  /**
   * Get List of Highlights data for given Reel Name
   * 
   * @param {string} type , defualy to get first 8 items only, else it will return entire items
   * @param {string} reportRuleId 
   * @param {string} reelName 
   * @param {string} [page='0'] 
   * @returns 
   * 
   * @memberOf HighlightsService
   */
  getHighlightReportPerReelName(type: string, reportRuleId: string, reelName: string, page = '0') {
    let api = ApiBuilder.getInstance();
    let pagePer;
    let pageNo;

    let highlightDataPerRealUrl = api.getHighlightsReportRulesPerReelGenericURL();
    if (type == "default") {
      pagePer = this.DEFAULT_CAM_COUNT;
      pageNo = 0;
    } else {
      //seemore
      pagePer = this.ITEMS_PER_PAGE;
      pageNo = page;
    }
    highlightDataPerRealUrl = highlightDataPerRealUrl.replace("REPORT_RULE_ID", reportRuleId);
    highlightDataPerRealUrl = highlightDataPerRealUrl.replace("PAGE_NO", pageNo);
    highlightDataPerRealUrl = highlightDataPerRealUrl.replace("PER_PAGE", pagePer);

    let that = this;
    return this.http
      .get(highlightDataPerRealUrl, {})
      .map(response => {
        let higlLightDataList = new HighlightDataList();
        let res = response.json();
        let reponseStatus = response.status;
        if (reponseStatus == this.RET_SUCCESS) {
          let reportItems = res.data.report_items;
          let camCount = reportItems.length;
          let pageCount = res.data.page_count;
          if (type == "default") {
            camCount = this.DEFAULT_CAM_COUNT;
          }
          let highlightDataArray = Array<LibCamera>();
          higlLightDataList.reelId = reportRuleId;
          higlLightDataList.pageCount = pageCount;
          for (let i = 0; i < camCount; i++) {
            if (!reportItems[i]) continue;
            let highlightData = new LibCamera();
            highlightData.endTime = reportItems[i].end_time;
            highlightData.startTime = reportItems[i].start_time;
            highlightData.exportId = reportItems[i].export_id;
            highlightData.status = reportItems[i].export_status;
            highlightData.percentComplete = +reportItems[i].export_percent_complete;
            highlightData.createdTime = reportItems[i].created_time;
            highlightData.thumbnailUrl = "api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=medium";
            highlightData.thumbnailUrlHighRes ="api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=large";
            highlightData.videoURL = "api/exports/" + highlightData.exportId + "/video.mp4";
            highlightData.siteName = reportItems[i].site_name;
            highlightData.timeZone = reportItems[i].site_timezone;
            highlightData.cameraName = reportItems[i].device_name;
            highlightData.videoTitle = highlightData.cameraName + ' ' + highlightData.startTime + '/' + highlightData.createdTime;
            highlightData.displayName = highlightData.siteName + ' - ' + highlightData.cameraName;
            highlightData.displayDescription = this.timeService.getLocalTimeforLibrary(highlightData.startTime, highlightData.timeZone);
            let displayCreatedDate = this.timeService.getLocalTimeforLibrary(reportItems[i].created_time, highlightData.timeZone);
            let displayStartDate = this.timeService.getLocalTimeforLibrary(reportItems[i].start_time, highlightData.timeZone);
            highlightData.videoTitle = highlightData.cameraName + ' ' + displayStartDate + '/ Created On:' + displayCreatedDate;
            highlightData.displayPercentComplete = false;

            highlightDataArray.push(highlightData);

          }
          higlLightDataList.cameraList = highlightDataArray;
          higlLightDataList.reelName = reelName;
        }
        else {
          console.log("getHighlightDataList HTTP call failed ");
        }
        return higlLightDataList;
      }
      );//.subscribe(result => console.log('Subscribe'));

  }

  /**
   * Get List of Highlights data for given Store Name
   * 
   * @param {string} type 
   * @param {string} storeId 
   * @param {string} [page='0'] 
   * @returns 
   * 
   * @memberOf HighlightsService
   */
  getHighlightReportPerStore(type: string, storeId: string, page = '0') {
    let api = ApiBuilder.getInstance();
    let pagePer;
    let pageNo;
    let highlightDataPerStore = api.getHighlightsReportRulesPerStoreURL();
    if (type == "default") {
      pagePer = this.DEFAULT_CAM_COUNT;
      pageNo = 0;
    } else {
      //seemore
      pagePer = this.ITEMS_PER_PAGE;
      pageNo = page;
    }
    highlightDataPerStore = highlightDataPerStore.replace("SITE_ID", storeId);
    highlightDataPerStore = highlightDataPerStore.replace("PAGE_NO", pageNo);
    highlightDataPerStore = highlightDataPerStore.replace("PER_PAGE", pagePer);

    let that = this;
    return this.http
      .get(highlightDataPerStore, {})
      .map(response => {
        let higlLightDataList = new HighlightDataList();
        let res = response.json();
        let reponseStatus = response.status;
        if (reponseStatus == this.RET_SUCCESS) {
          let reportItems = res.data.report_items;
          let pageCount = res.data.page_count;
          let camCount = reportItems.length;
          if (type == "default") {
            camCount = this.DEFAULT_CAM_COUNT;
          }

          let highlightDataArray = Array<LibCamera>();
          for (let i = 0; i < camCount; i++) {
            if (!reportItems[i]) continue;
            let highlightData = new LibCamera();
            highlightData.endTime = reportItems[i].end_time;
            highlightData.startTime = reportItems[i].start_time;
            highlightData.exportId = reportItems[i].export_id;
            highlightData.status = reportItems[i].export_status;
            highlightData.percentComplete = +reportItems[i].export_percent_complete;
            highlightData.createdTime = reportItems[i].created_time;
            highlightData.thumbnailUrl = "api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=medium";
            highlightData.thumbnailUrlHighRes ="api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=large";
            highlightData.videoURL = "api/exports/" + highlightData.exportId + "/video.mp4";
            highlightData.siteName = reportItems[i].site_name;
            highlightData.timeZone = reportItems[i].site_timezone;
            highlightData.cameraName = reportItems[i].device_name;
            highlightData.videoTitle = highlightData.cameraName + ' ' + highlightData.startTime + '/' + highlightData.createdTime;
            highlightData.displayName = highlightData.cameraName;
            highlightData.displayDescription = this.timeService.getLocalTimeforLibrary(highlightData.startTime, highlightData.timeZone);
            highlightData.displayPercentComplete = false;
            let displayCreatedDate = this.timeService.getLocalTimeforLibrary(reportItems[i].created_time, highlightData.timeZone);
            let displayStartDate = this.timeService.getLocalTimeforLibrary(reportItems[i].start_time, highlightData.timeZone);
            highlightData.videoTitle = highlightData.cameraName + ' ' + displayStartDate + '/ Created On:' + displayCreatedDate;
            highlightDataArray.push(highlightData);
          }
          higlLightDataList.cameraList = highlightDataArray;
          higlLightDataList.storeId = storeId;
          higlLightDataList.pageCount = pageCount;
        }
        else {
          console.log("getHighlightDataList HTTP call failed ");
        } return higlLightDataList;
      }
      );//.subscribe(result => console.log('Subscribe'));

  }

  /**
   * Get List of Highlights sorted by Reported Date
   * 
   * @param {string} page : Page Number
   * @returns 
   * 
   * @memberOf HighlightsService
   */
  getHighlightReportByDate(page: string) {
    if (Number(page) <= this.lastUpdatedPage) {
      return Observable.of(this.highlightDateWiseList);
    }
    let lastUpdatedDate;
    this.lastUpdatedPage++
    let api = ApiBuilder.getInstance();
    let highlightDataPerStore = api.getHighlightsReportbyStartTimeURL();
    highlightDataPerStore = highlightDataPerStore.replace("PAGE_NO", page);
    highlightDataPerStore = highlightDataPerStore.replace("PER_PAGE", "24");
    if ((this.highlightDateWiseList.length == 0)) {
      lastUpdatedDate = this.INFINITE_DATE;//jsut putting a infinite date
    } else {

      lastUpdatedDate = this.highlightDateWiseList[this.highlightDateWiseList.length - 1].clipDate;

    }

    if ((lastUpdatedDate == "") || (lastUpdatedDate == "undefined") || (lastUpdatedDate == null)) {
      lastUpdatedDate = this.INFINITE_DATE;
    }
    let that = this;
    return this.http
      .get(highlightDataPerStore, {})
      .map(response => {
        let higlLightDataList = new HighlightDataList();
        let res = response.json();
        let reponseStatus = response.status;
        if (reponseStatus == this.RET_SUCCESS) {

          let reportItems = res.data.report_items;
          higlLightDataList.pageCount = res.data.page_count;
          this.totalPageCount = res.data.page_count;
          let highlightDataArray = new Array<LibCamera>();
          for (let i = 0; i < reportItems.length; i++) {
            if (!reportItems[i]) continue;
            let highlightData = new LibCamera();
            highlightData.endTime = reportItems[i].end_time;
            highlightData.startTime = reportItems[i].start_time;
            highlightData.exportId = reportItems[i].export_id;
            highlightData.status = reportItems[i].export_status;
            highlightData.percentComplete = +reportItems[i].export_percent_complete;
            highlightData.createdTime = reportItems[i].created_time;
            highlightData.thumbnailUrl = "api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=medium";
            highlightData.thumbnailUrlHighRes ="api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=large";
            highlightData.videoURL = "api/exports/" + highlightData.exportId + "/video.mp4";
            highlightData.siteName = reportItems[i].site_name;
            highlightData.timeZone = reportItems[i].site_timezone;
            highlightData.cameraName = reportItems[i].device_name;
            highlightData.videoTitle = highlightData.cameraName + ' ' + highlightData.startTime + '/' + highlightData.createdTime;
            highlightData.displayName = highlightData.siteName + ' - ' + highlightData.cameraName;
            highlightData.displayDescription = this.timeService.getLocalTimeforLibrary(highlightData.startTime, highlightData.timeZone);
            highlightData.displayPercentComplete = false;
            highlightData.startTime = that.timeService.getDateOnlyfromUtc(highlightData.startTime, highlightData.timeZone);
            let displayCreatedDate = this.timeService.getLocalTimeforLibrary(reportItems[i].created_time, highlightData.timeZone);
            let displayStartDate = this.timeService.getLocalTimeforLibrary(reportItems[i].start_time, highlightData.timeZone);
            highlightData.videoTitle = highlightData.cameraName + ' ' + displayStartDate + '/ Created On:' + displayCreatedDate;
            //if given date is already added in the List ,append the new data to the same
            //else create the date and add.
            if (lastUpdatedDate == highlightData.startTime) {
              let highlighCameList = that.highlightDateWiseList[that.highlightDateWiseList.length - 1].cameraList;
              highlighCameList.push(highlightData);
              that.highlightDateWiseList[that.highlightDateWiseList.length - 1].cameraList = highlighCameList;
              that.highlightDateWiseList[that.highlightDateWiseList.length - 1].itemCount = highlighCameList.length;
              //cameraShortList contains 8 items to display on collapse screen
              if (highlighCameList.length > this.DEFAULT_CAM_COUNT) {
                that.highlightDateWiseList[that.highlightDateWiseList.length - 1].cameraShortList = _.slice(highlighCameList, 0, 8);
              } else {
                that.highlightDateWiseList[that.highlightDateWiseList.length - 1].cameraShortList = highlighCameList;
              }
            }
            else {
              if (this.timeService.isFormatedStartDateIsGreater(lastUpdatedDate, highlightData.startTime)) {
                higlLightDataList = new HighlightDataList();
                higlLightDataList.itemCount = 1;
                higlLightDataList.clipDate = highlightData.startTime;
                highlightDataArray = new Array<LibCamera>();
                highlightDataArray.push(highlightData);
                higlLightDataList.cameraList = highlightDataArray;
                higlLightDataList.cameraShortList = highlightDataArray;
                that.highlightDateWiseList.push(higlLightDataList);
                lastUpdatedDate = higlLightDataList.clipDate;
              }
            }

          }
          /*  for (let i = 0; i < this.highlightDateWiseList.length; i++) {
              console.log(">>>>> DATE ", this.highlightDateWiseList[i].clipDate);
              console.log(">>>>> FULL SHORT Length ", this.highlightDateWiseList[i].cameraShortList.length);
            }*/
        }
        else {
          console.log("getHighlightDataList HTTP call failed ");
        }
        return that.highlightDateWiseList

      }
      );//.subscribe(result => console.log('Subscribe'));
  }

  /**
   * Get List of ungrouped Highlights items
   * 
   * @param {string} type 
   * @param {string} page 
   * @returns 
   * 
   * @memberOf HighlightsService
   */
  getHighlightReportUngrouped(type: string, page: string) {
    let api = ApiBuilder.getInstance();
    let pagePer;
    let pageNo;
    let highlightDataPerStore = api.getHighlightsReportbyStartTimeURL();
    if (type = "default") {
      pagePer = this.ITEMS_PER_PAGE;
      pageNo = 0;
    } else {
      //seemore
      pagePer = this.ITEMS_PER_PAGE;
      pageNo = page;
    }
    highlightDataPerStore = highlightDataPerStore.replace("PAGE_NO", pageNo);
    highlightDataPerStore = highlightDataPerStore.replace("PER_PAGE", pagePer);

    let that = this;
    return this.http
      .get(highlightDataPerStore, {})
      .map(response => {
        let higlLightDataList = new HighlightDataList();
        let res = response.json();
        let reponseStatus = response.status;

        if (reponseStatus == this.RET_SUCCESS) {
          let reportItems = res.data.report_items;
          let highlightDataArray = Array<LibCamera>();
          for (let i = 0; i < reportItems.length; i++) {
            if (!reportItems[i]) continue;
            let highlightData = new LibCamera();
            highlightData.endTime = reportItems[i].end_time;
            highlightData.startTime = reportItems[i].start_time;
            highlightData.exportId = reportItems[i].export_id;
            highlightData.status = reportItems[i].export_status;
            highlightData.percentComplete = +reportItems[i].export_percent_complete;
            highlightData.createdTime = reportItems[i].created_time;
            highlightData.thumbnailUrl = "api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=medium";
            highlightData.thumbnailUrlHighRes ="api/exports/" + highlightData.exportId + "/thumbnail.jpeg?size=large";
            highlightData.videoURL = "api/exports/" + highlightData.exportId + "/video.mp4";
            highlightData.siteName = reportItems[i].site_name;
            highlightData.timeZone = reportItems[i].site_timezone;
            highlightData.cameraName = reportItems[i].device_name;
            highlightData.displayName = highlightData.siteName + ' - ' + highlightData.cameraName;
            highlightData.displayDescription = this.timeService.getLocalTimeforLibrary(highlightData.startTime, highlightData.timeZone);
            highlightData.displayPercentComplete = false;
            let displayCreatedDate = this.timeService.getLocalTimeforLibrary(reportItems[i].created_time, highlightData.timeZone);
            let displayStartDate = this.timeService.getLocalTimeforLibrary(reportItems[i].start_time, highlightData.timeZone);
            highlightData.videoTitle = highlightData.cameraName + ' ' + displayStartDate + '/ Created On:' + displayCreatedDate;
            highlightDataArray.push(highlightData);
          }
          higlLightDataList.cameraList = highlightDataArray;
        }
        else {
          console.log("getHighlightDataList HTTP call failed ");
        } return higlLightDataList;
      }
      );//.subscribe(result => console.log('Subscribe'));

  }
  // HASHIM
  /**
   * 
   * 
   * 
   * @memberOf HighlightsService
   */
  getClipDateLibData() {
    // let libDataList = _.filter(this.highlightDateWiseList, function (o) {
    //   return o.clipDate == this.dateSelected;
    // });

    for (let item of this.highlightDateWiseList) {
      if (item.clipDate == this.dateSelected) {
        this.datewiseSeeMoreList = item.cameraList;
      }
    }

    this.loadingSpinnerOn = false;
  }
  // HASHIM
  /**
   * 
   * 
   * @param {*} camera 
   * 
   * @memberOf HighlightsService
   */
  onImageSelected(camera: any) {
    if (camera.selected) {
      this.selectedItemCount++;
      this.selectedVideoUrls.push(camera.videoURL)
      this.selectedHlVideos.push(camera);
      this.selectedCameras.push(camera);
      this.setCountString();
      this.downloadBarActive = true;
    }
    else {
      let itemIndex = this.selectedVideoUrls.indexOf(camera.videoURL);
      this.selectedVideoUrls.splice(itemIndex, 1);
      this.selectedHlVideos.splice(itemIndex, 1);
      let i2 = this.selectedCameras.indexOf(camera);
      this.selectedCameras.splice(i2, 1);
      this.selectedItemCount--;
      this.setCountString();
      if (this.selectedItemCount == 0) {
        this.downloadBarActive = false;
      }
    }
  }


  private setCountString() {
    if (this.selectedItemCount < 10) {
      this.selectedItemCountStr = '0' + this.selectedItemCount;
    }
    else {
      this.selectedItemCountStr = '' + this.selectedItemCount;
    }
  }

  ngOnDestroy() {
    this.selectedVideoUrls = null;
    this.selectedHlVideos = null;
    this.selectedItemCount = 0;
    this.downloadBarActive = false;
  }
}
