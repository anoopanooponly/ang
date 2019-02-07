/**********************************************************************************
* File Name   :   PlayerService.ts
* Description :   This class implements API client interface for Player, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 20-Dec-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Constants } from './../model/constants';
import { PeopleCountingService } from './people-counting.service';
import { Injectable } from '@angular/core';
import { ApiBuilder } from './../utilities/api-builder';
import { TimeService } from './time.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MotionEvents } from './../model/motion-events';
import { RecordingEvents } from './../model/recording-events';
import { ExportingEvents } from './../model/exporting-events';
import { PlayerThumbnail } from './../model/player-thumbnail';
import { DateFormat } from './../model/date-format';
import { FilterService } from './filter.service';
import { PlaybackBaseurl } from './../model/playback-baseurl';
import { CookieService } from './cookie.service';
import { PlayerCalendarData } from './../model/player-calendar-data';

@Injectable()
export class PlayerService {
    private motionEventsUrl: string;
    private recordingEventsUrl: string;
    private exportingEventsUrl: string;
    private apiBuilder;
    private result;
    private yamsPlaybackBaseUrl;
    public playerCalendarDate: DateFormat = new DateFormat;
    public playerTitleDate: PlayerCalendarData = new PlayerCalendarData;
    private localConnectivityStatus: boolean;
    timezone: any;

    /**
     * Creates an instance of PlayerService.
     * @param {Http} http 
     * @param {TimeService} timeService 
     * @param {CookieService} cookieService 
     * 
     * @memberOf PlayerService
     */
    constructor(private http: Http,
        private timeService: TimeService,
        private cookieService: CookieService) {
        let api = ApiBuilder.getInstance();
        this.apiBuilder = api;


    }

    /**
     * Get recording event list of given camera for given time range
     * 
     * @param {string} cameraUid 
     * @param {string} startTime 
     * @param {string} endTime 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getRecordingEventList(cameraUid: string, startTime: string, endTime: string) {

        let api = ApiBuilder.getInstance();
        this.recordingEventsUrl = api.getRecordingEventsGenericURL();
        this.recordingEventsUrl = this.recordingEventsUrl.replace("DEVICE_ID", cameraUid);
        this.recordingEventsUrl = this.recordingEventsUrl.replace("START_TIME", startTime);
        this.recordingEventsUrl = this.recordingEventsUrl.replace("END_TIME", endTime);

        // let motionEventUrl = this.getMotionEventURL(cameraUid,startTime,endTime);

        let that = this;
        return this.http
            .get(this.recordingEventsUrl, {})
            .map(response => {
                let recordingEventList = new Array<RecordingEvents>();
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == 200) {
                    let recording_events = res.data.contents;
                    for (let i = 0; i < recording_events.length; i++) {
                        let recordingData = new RecordingEvents();
                        recordingData.endTime = recording_events[i].end_time;
                        recordingData.startTime = recording_events[i].start_time;
                        recordingEventList.push(recordingData);
                    }
                    return recordingEventList;
                }
                else {
                    // console.log("getRecordingEventList HTTP call failed ");
                }

            });

    }

    /**
     * Get exporting event list of given camera for given time range
     * 
     * @param {string} cameraUid 
     * @param {string} startTime 
     * @param {string} endTime 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getExportingEventList(cameraUid: string, startTime: string, endTime: string) {

        let api = ApiBuilder.getInstance();
        this.exportingEventsUrl = api.getExportingEventsGenericURL();
        this.exportingEventsUrl = this.exportingEventsUrl.replace("DEVICE_ID", cameraUid);
        this.exportingEventsUrl = this.exportingEventsUrl.replace("START_TIME", startTime);
        this.exportingEventsUrl = this.exportingEventsUrl.replace("END_TIME", endTime);

        return this.http
            .get(this.exportingEventsUrl, {})
            .map(response => {
                let exportingEventList = new Array<ExportingEvents>();
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == 200) {
                    let exporting_events = res.data.exports;
                    for (let i = 0; i < exporting_events.length; i++) {
                        let exportingData = new ExportingEvents();
                        exportingData.endTime = exporting_events[i].end_time;
                        exportingData.startTime = exporting_events[i].start_time;
                        exportingEventList.push(exportingData);
                    }
                    return exportingEventList;
                }
                else {
                    //console.log("getExportingEventList HTTP call failed ");
                }
            });
    }

    /**
     * Get Motion event list of given camera for given time range
     * 
     * @param {string} cameraUid 
     * @param {string} startTime 
     * @param {string} endTime 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getMotionEventList(cameraUid: string, startTime: string, endTime: string) {
        let motionEventUrl = this.getMotionEventURL(cameraUid, startTime, endTime);
        let that = this;

        return this.http
            .get(motionEventUrl, {})
            .map(response => {
                let motionEventList = new Array<MotionEvents>();
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == 200) {
                    let motion_events = res.data.motion_events;
                    for (let i = 0; i < motion_events.length; i++) {
                        let motionData = new MotionEvents();
                        motionData.endTime = motion_events[i].end_time;
                        motionData.keyframeTime = motion_events[i].keyframe_time;
                        motionData.startTime = motion_events[i].start_time;
                        let timeSpan: number = this.timeService.getTimeDifferenceInSeconds(startTime, endTime) / 1000;
                        let m: number = 0.1333;
                        let y_intercept: number = 1.66;
                        motionData.jumpTime = (m * timeSpan) + y_intercept;
                        if (motionData.jumpTime < 1) motionData.jumpTime = 1;
                        motionEventList.push(motionData);
                    }
                    return motionEventList;
                }
                else {
                    //console.log(" getMotionEventList HTTP call failed ");
                }
            });
    }

    /**
     * get URL for motion event based on cameraUID and date range
     * 
     * @param {string} cameraUid 
     * @param {string} startTime 
     * @param {string} endTime 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getMotionEventURL(cameraUid: string, startTime: string, endTime: string) {
        let seconds = this.timeService.getTimeDifferenceInSeconds(startTime, endTime);
        let mValue: number = 3.979591836734694;
        let yInter: number = 612.2448979591837;
        let gap: number;
        let gapMin: number;
        gap = (mValue * seconds) + yInter;
        if (gap < 10000)
            gap = 10000;
        gapMin = Math.round(gap);

        this.motionEventsUrl
        let api = ApiBuilder.getInstance();
        this.motionEventsUrl = api.getMotionEventsGenericURL();
        if (this.motionEventsUrl == null) {
        }
        this.motionEventsUrl = this.motionEventsUrl.replace("DEVICE_ID", cameraUid);
        this.motionEventsUrl = this.motionEventsUrl.replace("START_TIME", startTime);
        this.motionEventsUrl = this.motionEventsUrl.replace("END_TIME", endTime);
        this.motionEventsUrl = this.motionEventsUrl.replace("GAP_MIN", gapMin.toString());
        return this.motionEventsUrl;
    }

    /**
     * Get the High resolution thumbnail URL for player 
     * 
     * @param {string} cameraUid 
     * @param {string} utcTime 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getPlayerHighResolutionThumbnail(cameraUid: string, utcTime: string) {

        let api = ApiBuilder.getInstance();
        let thumbnailUrl = api.getPlayerThumbnailGenericURLforHighRes();
        thumbnailUrl = thumbnailUrl.replace("DEVICE_UID", cameraUid);
        thumbnailUrl = thumbnailUrl.replace("RFCTIME", utcTime);
        return thumbnailUrl;
    }

    /**
     *  Get the Low resolution thumbnail URL for player 
     * 
     * @param {string} cameraUid 
     * @param {string} utcTime 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getPlayerLowResolutionThumbnail(cameraUid: string, utcTime: string) {

        let api = ApiBuilder.getInstance();
        let thumbnailUrl = api.getPlayerThumbnailGenericURLforLowRes();
        thumbnailUrl = thumbnailUrl.replace("DEVICE_UID", cameraUid);
        thumbnailUrl = thumbnailUrl.replace("RFCTIME", utcTime);
        return thumbnailUrl;
    }

    /**
     * Get player Thumbnail list of given camera for given date range
     * 
     * @param {string} cameraUid 
     * @param {string} startTime 
     * @param {number} duration 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getPlayerThumbnailList(cameraUid: string, startTime: string, duration: number) {
        let timeSpan = duration / 50;
        let thumbnailUrlList = new Array<PlayerThumbnail>();
        for (let i = 0; i < 50; i++) {
            let playerThumbnail = new PlayerThumbnail();
            let newSatrt = this.timeService.getPostDate(startTime, timeSpan / 60);
            startTime = newSatrt;
            playerThumbnail.startTime = startTime;
            playerThumbnail.lowResUrl = this.getPlayerLowResolutionThumbnail(cameraUid, startTime);
            playerThumbnail.highResUrl = this.getPlayerHighResolutionThumbnail(cameraUid, startTime);
            thumbnailUrlList.push(playerThumbnail);
        }
        return thumbnailUrlList;

    }

    /**
     * Get Motion Thumbnail list of given camera
     * 
     * @param {string} cameraUid 
     * @param {Array<MotionEvents>} motionEventList 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getMotionThumbnailList(cameraUid: string, motionEventList: Array<MotionEvents>) {
        let thumbnailUrlList = new Array<PlayerThumbnail>();
        for (let i = 0; i < motionEventList.length; i++) {
            let motionData = motionEventList[i];
            let endTime = motionData.endTime;
            let jumpTime = motionData.jumpTime;
            let startTime = motionData.startTime;
            while (this.timeService.isStartTimeExceedEndTime(startTime, endTime) == false) {
                let playerThumbnail = new PlayerThumbnail();
                playerThumbnail.lowResUrl = this.getPlayerLowResolutionThumbnail(cameraUid, startTime);
                playerThumbnail.highResUrl = this.getPlayerHighResolutionThumbnail(cameraUid, startTime);
                playerThumbnail.startTime = startTime;
                startTime = this.timeService.getPostDate(startTime, jumpTime);
                thumbnailUrlList.push(playerThumbnail);
            }
        }
        return thumbnailUrlList;
    }

    /**
     * Crete clip for given store/camera
     * 
     * @param {string} deviceId 
     * @param {string} startTime 
     * @param {string} endTime 
     * @param {string} visibility 
     * @param {string} clipName 
     * @param {string} notes 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    createClip(deviceId: string, startTime: string, endTime: string, visibility: string, clipName: string, notes: string) {
        if ((deviceId == null) || (startTime == null) || (endTime == null)) {
            return null;
        }
        let api = ApiBuilder.getInstance();
        let createClipUrl = api.getCreateClipEventsGenericURL();
        var body = { "start_time": startTime, "end_time": endTime, "device_id": deviceId, "shared_with_org": visibility, "name": name, "notes": notes }
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', '*/*');
        return this.http
            .post(createClipUrl, body, { headers: headers });
    }

    /**
     * set the claender date
     * 
     * @param {DateFormat} titledate 
     * @param {*} timezone 
     * 
     * @memberOf PlayerService
     */
    setPlayerCalendarDate(titledate: DateFormat, timezone: any) {

        this.playerCalendarDate.day = titledate.day;
        this.playerCalendarDate.month = titledate.month;
        this.playerCalendarDate.year = titledate.year;
        this.timezone = timezone;
    }

    /**
     * set plater start and end date
     * 
     * @param {string} start 
     * @param {string} end 
     * 
     * @memberOf PlayerService
     */
    setPlayerTitleDate(start: string, end: string) {
        this.playerTitleDate.starttime = start;
        this.playerTitleDate.endtime = end;
    }

    /**
     * Get Yarms base URL
     * 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    loadYamsBaseUrl() {
        let that = this;
        let api = ApiBuilder.getInstance();
        let yamsURL = api.getYamsInfoURL();
        this.yamsPlaybackBaseUrl = new PlaybackBaseurl();

        return this.http
            .get(yamsURL, {})
            .map(response => {
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == 200) {
                    let httpPort = res.port_http;
                    let httpsPort = res.port_https;
                    let dns = res.public_dns;
                    let ipv4 = res.public_ipv4;
                    this.yamsPlaybackBaseUrl.baseUrl = "https://" + dns + ":" + httpsPort;
                    this.yamsPlaybackBaseUrl.gatewayIP = ipv4;
                }
            }
            );
    }
    getLocalPlaybackStreamingUrl(localPlayBackUrl: string) {
        let that = this;
        let api = ApiBuilder.getInstance();
        let playbackBase = new PlaybackBaseurl();
        return this.http
            .get(localPlayBackUrl, {})
            .timeout(10000)
            .map(response => {
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == 200) {
                    let httpPort = res.port_http;
                    let httpsPort = res.port_https;
                    let dns = res.public_dns;
                    let ipv4 = res.public_ipv4;

                    playbackBase.baseUrl = "http://" + dns + "/yams";
                    playbackBase.gatewayIP = ipv4;
                }
                else {
                    playbackBase = null;
                }
                return playbackBase;
            }
            );
    }

    /**
     * Get Yarms URL
     * 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getYamsBaseUrl() {
        return this.yamsPlaybackBaseUrl;
    }

    /**
     * Get local playback URL
     * 
     * @param {string} gateway 
     * @returns 
     * 
     * @memberOf PlayerService
     */
    getLocalPlaybackBaseURL(gateway: string) {
        let playbackBaseUrl = new PlaybackBaseurl();
        let api = ApiBuilder.getInstance();
        let storeUrl = api.getStoreURL();
        playbackBaseUrl.baseUrl = "http://" + gateway + "/hermes/gateway/id";
        playbackBaseUrl.gatewayIP = gateway;
        return playbackBaseUrl;
    }
    getLocalConnectivityStatus() {
        return this.localConnectivityStatus;
    }
    setLocalConnectivityStatus(status: boolean) {
        this.localConnectivityStatus = status;
    }
}

