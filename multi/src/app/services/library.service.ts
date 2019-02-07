/**********************************************************************************
* File Name   :   LibraryService.ts
* Description :   This class implements API client interface for Library, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 20-Dec-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Visibility } from './../model/visibility';
import { LibdataDatewise } from './../model/libdata-datewise';
import { Store } from './../model/store';
import { LibCamera } from './../model/lib-camera';
import { LibraryData } from './../model/library-data';
import { Injectable } from '@angular/core';
import { ApiBuilder } from './../utilities/api-builder';
import { TimeService } from './time.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as _ from 'lodash';

@Injectable()
export class LibraryService {
    public downloadBarActive = false;
    public LibraryGroupBy;
    private apiBuilder;
    private pageCount: number;
    private itemCount: number;
    public storeList;
    public cameraListUngrouped;
    public libDatacontainer: LibraryData;
    private RET_SUCCESS = 200;
    public groupBySelected: boolean;
    public playerOpen: boolean;
    public seeMoreSelected: boolean;
    public storesHavingCamera: any;
    public loadingSpinnerOn = true;
    public seeMoreBackButtonOn = false;
    public PageName: string;
    public SeeMoreFromPageName: string;
    public result;
    private INFINITE_DATE = "Dec 31,9999";

    public libDataMapForClipDate = new Array<LibdataDatewise>();
    public libDataMapForCreatedDate = new Array<LibdataDatewise>();
    public dataVisiblity: string;
    public dataVisiblityDisplay: string;

    public selectedVideoUrl: string;
    public selectedThumbNailUrl: string;
    public selectedStoreId: string;
    public selectedItemCount: number;
    public selectedItemCountStr: string;
    public selectedVideoUrls = new Array<string>();
    public selectedLibVideos = new Array<any>();
    public selectedCameraName: string;
    public selectedClipDate: string;
    public selectedClipCreatedDate: string;
    public selectedCameras = new Array<any>();

    public currentPageNo: number;
    public datewiseSeeMoreList = [];

    private libPerDate: LibdataDatewise;
    private lastUpdatedDate: string;
    private callNextPage: boolean;
    private waitingForSortByDateResponse = false;
    private waitingForSortByClipResponse = false;
    public totalClipDatePageCount = 1;
    public totalCreatedDatePageCount = 1;

    public visibilityComboShow: boolean;

    /**
     * Creates an instance of LibraryService.
     * @param {Http} http 
     * @param {TimeService} timeService 
     * 
     * @memberOf LibraryService
     */
    constructor(private http: Http, private timeService: TimeService) {
        this.callNextPage = false;
        let api = ApiBuilder.getInstance();
        this.apiBuilder = api;
        this.LibraryGroupBy = '';
        this.storesHavingCamera = new Array<Store>();
        this.playerOpen = false;
        this.selectedItemCount = 0;
        this.getClipCompletionPercentage("");
        this.visibilityComboShow = true;
    }

    /**
     * Get the list of ungrouped Library
     * 
     * @param {string} pageno 
     * @param {string} visibility 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getLibraryDataUngrouped(pageno: string, visibility: string) {
        let api = ApiBuilder.getInstance();
        let libraryDataUrl = api.getLibraryDataGenericURL(visibility);

        libraryDataUrl = libraryDataUrl.replace("PAGE_NO", pageno);
        libraryDataUrl = libraryDataUrl.replace("PER_PAGE", "12");
        let that = this;
        return this.http
            .get(libraryDataUrl, {})
            .map(response => {

                let libCameraList = new Array<LibCamera>();
                let libDatacontainer = new LibraryData();
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    let exportsEvents = res.data.clips;
                    let libData = new LibraryData();
                    libData.itemCount = res.data.item_count;
                    libData.pageCount = res.data.page_count;
                    libData.currentPageNo = parseInt(pageno);
                    for (let i = 0; i < exportsEvents.length; i++) {
                        let libCamData = new LibCamera();

                        libCamData.endTime = exportsEvents[i].end_time;
                        libCamData.startTime = exportsEvents[i].start_time;
                        libCamData.exportId = exportsEvents[i].id;
                        libCamData.status = exportsEvents[i].status;
                        libCamData.percentComplete = +exportsEvents[i].percent_complete;
                        libCamData.createdTime = exportsEvents[i].created_time;
                        libCamData.type = exportsEvents[i].type;
                        libCamData.thumbnailUrl = "api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=medium"
                        libCamData.thumbnailUrlHighRes ="api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=large"
                        libCamData.videoURL = "api/clips/" + libCamData.exportId + "/video.mp4"
                        if (exportsEvents[i].site) {
                            libCamData.siteName = exportsEvents[i].site.name;
                        } else {
                            // console.log(" No Site data ");
                        }

                        if (exportsEvents[i].device) {
                            libCamData.cameraId = exportsEvents[i].device.id;
                            libCamData.cameraUid = exportsEvents[i].device.uid;
                            libCamData.cameraName = exportsEvents[i].device.name;
                            libCamData.displayName = libCamData.siteName + ' - ' + libCamData.cameraName;
                            libCamData.displayDescription = this.timeService.getLocalTimeforLibrary(libCamData.startTime, libCamData.timeZone);
                            libCamData.displayPercentComplete = true;
                            if (exportsEvents[i].device.assigned_gateway) {
                                libCamData.timeZone = exportsEvents[i].device.assigned_gateway.timezone;

                            } else {
                                //console.log("No DeviceData ");
                            }
                        } else {
                            continue;
                        }
                        let displayCreatedDate = this.timeService.getLocalTimeforLibrary(libCamData.createdTime, libCamData.timeZone);
                        libCamData.startTime = this.timeService.getLocalTimeforLibrary(libCamData.startTime, libCamData.timeZone);
                        libCamData.videoTitle = libCamData.cameraName + ' ' + libCamData.startTime + '/ Created On:' + displayCreatedDate;
                        libCameraList.push(libCamData);
                    }
                    libData.cameraList = libCameraList;
                    this.cameraListUngrouped = libCameraList;
                    return libData;
                }
                else {
                }
            });
    }

    /**
     * Get Library itesm for given store name
     * 
     * @param {string} storeID 
     * @param {string} visibility 
     * @param {string} [page='default'] 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getLibraryDataPerStore(storeID: string, visibility: string, page = 'default') {
        let api = ApiBuilder.getInstance();
        let libraryDataUrl;
        libraryDataUrl = api.getLibraryDatabyStoreGenericURL(visibility);
        if (page == 'default') {

            libraryDataUrl = libraryDataUrl.replace("PAGE_NO", 0);
            libraryDataUrl = libraryDataUrl.replace("PER_PAGE", "8");
        } else {
            libraryDataUrl = libraryDataUrl.replace("PAGE_NO", page);
            libraryDataUrl = libraryDataUrl.replace("PER_PAGE", "100");
        }
        libraryDataUrl = libraryDataUrl.replace("SITE_ID", storeID);

        let that = this;
        return this.http
            .get(libraryDataUrl, {})
            .map(response => {

                let libCameraList = new Array<LibCamera>();
                let libData = new LibraryData();
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    let exportsEvents = res.data.clips;
                    libData.itemCount = res.data.item_count;
                    libData.pageCount = res.data.page_count;
                    libData.currentPageNo = 0;
                    libData.storeId = storeID;
                    for (let i = 0; i < exportsEvents.length; i++) {
                        let libCamData = new LibCamera();
                        libCamData.endTime = exportsEvents[i].end_time;
                        libCamData.startTime = exportsEvents[i].start_time;
                        libCamData.exportId = exportsEvents[i].id;
                        libCamData.status = exportsEvents[i].status;
                        libCamData.percentComplete = +exportsEvents[i].percent_complete;
                        libCamData.createdTime = exportsEvents[i].created_time;
                        libCamData.type = exportsEvents[i].type;
                        libCamData.thumbnailUrl = "api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=medium"
                        libCamData.thumbnailUrlHighRes ="api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=large"
                        libCamData.videoURL = "api/clips/" + libCamData.exportId + "/video.mp4"
                        if (exportsEvents[i].site) {
                            libCamData.siteName = exportsEvents[i].site.name;
                        } else {
                            //console.log(" No Site data ");
                        }

                        if (exportsEvents[i].device != null) {
                            libCamData.cameraId = exportsEvents[i].device.id;
                            libCamData.cameraUid = exportsEvents[i].device.uid;
                            libCamData.cameraName = exportsEvents[i].device.name;
                            libCamData.displayName = libCamData.cameraName;
                            let displayCreatedDate = this.timeService.getLocalTimeforLibrary(libCamData.createdTime, libCamData.timeZone);
                            let displayClipTime = this.timeService.getLocalTimeforLibrary(libCamData.startTime, libCamData.timeZone);
                            libCamData.videoTitle = libCamData.cameraName + ' ' + displayClipTime + '/ Created On:' + displayCreatedDate;
                            libCamData.displayDescription = displayClipTime;
                            libCamData.displayPercentComplete = true;
                            if (exportsEvents[i].device.assigned_gateway != null) {
                                libCamData.timeZone = exportsEvents[i].device.assigned_gateway.timezone;
                            } else {
                                //console.log("No DeviceData ");
                            }
                        } else {
                            //console.log(" No Device Data ");
                        }
                        libCameraList.push(libCamData);
                    }
                    libData.cameraList = libCameraList;
                    return libData;
                }
                else {
                    console.log("getLibraryDataUngrouped HTTP call failed ");
                }

            });

    }

    /**
     * Get Library data sorted by created date, data will be availbe @libDataMapForCreatedDate
     * 
     * @param {string} pageno 
     * @param {string} visibility 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getLibraryDataSortbyDateCreated(pageno: string, visibility: string) {
        let api = ApiBuilder.getInstance();
        let libraryDataUrl = api.getLibraryDataGenericURL(visibility);
        let prevLibCamData = new LibCamera();
        libraryDataUrl = libraryDataUrl.replace("PAGE_NO", pageno);
        libraryDataUrl = libraryDataUrl.replace("PER_PAGE", "12");
        libraryDataUrl = libraryDataUrl.replace("start_time", "created_time");
        let that = this;
        return this.http
            .get(libraryDataUrl, {})
            .map(response => {
                let res = response.json();
                let reponseStatus = response.status;
                let lastUpdatedDate;
                if (reponseStatus == 200) {
                    let exportsEvents = res.data.clips;
                    let libDataList = new Array<LibdataDatewise>();
                    let camList = new Array<LibCamera>();
                    this.totalCreatedDatePageCount = res.data.page_count;
                    let dateCount = 0;
                    if (this.libDataMapForCreatedDate.length == 0) {
                        lastUpdatedDate = this.INFINITE_DATE;
                    } else {
                        lastUpdatedDate = this.libDataMapForCreatedDate[this.libDataMapForCreatedDate.length - 1].createdDate;
                    }
                    if ((lastUpdatedDate == "") || (lastUpdatedDate == "undefined") || (lastUpdatedDate == null)) {
                        lastUpdatedDate = this.INFINITE_DATE;
                    }
                    for (let i = 0; i < exportsEvents.length; i++) {
                        let libCamData = new LibCamera();
                        libCamData.endTime = exportsEvents[i].end_time;
                        libCamData.startTime = exportsEvents[i].start_time;
                        libCamData.exportId = exportsEvents[i].id;
                        libCamData.status = exportsEvents[i].status;
                        libCamData.percentComplete = +exportsEvents[i].percent_complete;

                        libCamData.type = exportsEvents[i].type;
                        libCamData.thumbnailUrl = "api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=medium";
                        libCamData.thumbnailUrlHighRes ="api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=large";
                        libCamData.videoURL = "api/clips/" + libCamData.exportId + "/video.mp4"
                        if (exportsEvents[i].site) {
                            libCamData.siteName = exportsEvents[i].site.name;
                        } else {
                            // console.log(" No Site data ");
                        } 

                        if (exportsEvents[i].device) {
                            libCamData.cameraId = exportsEvents[i].device.id;
                            libCamData.cameraUid = exportsEvents[i].device.uid;
                            libCamData.cameraName = exportsEvents[i].device.name;
                            libCamData.displayName = libCamData.siteName + ' - ' + libCamData.cameraName;
                            libCamData.displayPercentComplete = true;
                            if (exportsEvents[i].device.assigned_gateway) {
                                libCamData.timeZone = exportsEvents[i].device.assigned_gateway.timezone;

                            } else {
                                //console.log(" No DeviceData ");
                            }
                        } else {
                            // console.log("No Device Data ");
                        }

                        libCamData.createdTime = that.timeService.getDateOnlyfromUtc(exportsEvents[i].created_time, libCamData.timeZone);
                        let displayStartTime = that.timeService.getLocalTimeforLibrary(exportsEvents[i].start_time, libCamData.timeZone);
                        let displayCreatedTime = that.timeService.getLocalTimeforLibrary(exportsEvents[i].created_time, libCamData.timeZone);
                        libCamData.videoTitle = libCamData.cameraName + ' ' + displayStartTime + '/ Created on :' + displayCreatedTime;
                        libCamData.displayDescription = displayCreatedTime;
                        //if camdata date is already added in the list , add the data in same item, else create new date and add the content 
                        if (lastUpdatedDate == libCamData.createdTime) {
                            let LibCameList = that.libDataMapForCreatedDate[that.libDataMapForCreatedDate.length - 1].cameraList;
                            LibCameList.push(libCamData);
                            that.libDataMapForCreatedDate[that.libDataMapForCreatedDate.length - 1].cameraList = LibCameList;
                            that.libDataMapForCreatedDate[that.libDataMapForCreatedDate.length - 1].itemCount = LibCameList.length;
                            //cameraShortList contain the first eight items
                            if (LibCameList.length > 8) {
                                that.libDataMapForCreatedDate[that.libDataMapForCreatedDate.length - 1].cameraShortList = _.slice(LibCameList, 0, 8);
                            } else {
                                that.libDataMapForCreatedDate[that.libDataMapForCreatedDate.length - 1].cameraShortList = LibCameList;
                            }
                        }
                        else {
                            if (that.timeService.isFormatedStartDateIsGreater(lastUpdatedDate, libCamData.createdTime)) {
                                let libDataDateWise = new LibdataDatewise();
                                libDataDateWise.createdDate = libCamData.createdTime;
                                that.timeService.isFormatedStartDateIsGreater(lastUpdatedDate, libDataDateWise.createdDate);
                                let libDataArray = new Array<LibCamera>();
                                libDataArray.push(libCamData);
                                libDataDateWise.cameraList = libDataArray;
                                libDataDateWise.itemCount = 1;
                                libDataDateWise.cameraShortList = libDataArray;
                                that.libDataMapForCreatedDate.push(libDataDateWise);
                                lastUpdatedDate = libCamData.createdTime;
                            }

                        }

                    }

                    return that.libDataMapForCreatedDate;
                }
                else {
                    console.log(" getLibraryDataDateCreated _ FAILED ");
                }
            });//.subscribe(result => this.result = result);;;
    }

    /**
     * Get Library List sorted by clip date,content will be append @libDataMapForClipDate
     * 
     * @param {string} pageno 
     * @param {string} visibility 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getLibraryDataSortbyClipDate(pageno: string, visibility: string) {
        let api = ApiBuilder.getInstance();
        let libraryDataUrl = api.getLibraryDataGenericURL(visibility);
        let prevLibCamData = new LibCamera();
        libraryDataUrl = libraryDataUrl.replace("PAGE_NO", pageno);
        libraryDataUrl = libraryDataUrl.replace("PER_PAGE", "12");
        let that = this;
        return this.http
            .get(libraryDataUrl, {})
            .map(response => {
                let lastUpdatedDate;
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    let exportsEvents = res.data.clips;
                    let libDataList = new Array<LibdataDatewise>();
                    let camList = new Array<LibCamera>();
                    this.totalClipDatePageCount = res.data.page_count;
                    let pageCount = res.data.page_count;
                    let dateCount = 0;
                    if ((this.libDataMapForClipDate.length == 0)) {
                        lastUpdatedDate = this.INFINITE_DATE;//jsut putting a infinite date
                    } else {

                        lastUpdatedDate = this.libDataMapForClipDate[this.libDataMapForClipDate.length - 1].clipDate;
                    }

                    if ((lastUpdatedDate == "") || (lastUpdatedDate == "undefined") || (lastUpdatedDate == null)) {
                        lastUpdatedDate = this.INFINITE_DATE;
                    }

                    for (let i = 0; i < exportsEvents.length; i++) {
                        let libCamData = new LibCamera();
                        libCamData.endTime = exportsEvents[i].end_time;
                        libCamData.exportId = exportsEvents[i].id;
                        libCamData.status = exportsEvents[i].status;
                        libCamData.percentComplete = +exportsEvents[i].percent_complete;
                        libCamData.createdTime = this.timeService.getLocalTimeforLibrary(exportsEvents[i].created_time, libCamData.timeZone);

                        libCamData.type = exportsEvents[i].type;
                        libCamData.thumbnailUrl = "api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=medium"
                        libCamData.thumbnailUrlHighRes ="api/clips/" + libCamData.exportId + "/thumbnail.jpeg?size=large"
                        libCamData.videoURL = "api/clips/" + libCamData.exportId + "/video.mp4"
                        if (exportsEvents[i].site) {
                            libCamData.siteName = exportsEvents[i].site.name;
                        } else {
                            // console.log("No Site data ");
                        }

                        if (exportsEvents[i].device) {
                            libCamData.cameraId = exportsEvents[i].device.id;
                            libCamData.cameraUid = exportsEvents[i].device.uid;
                            libCamData.cameraName = exportsEvents[i].device.name;
                            libCamData.displayName = libCamData.siteName + ' - ' + libCamData.cameraName;
                            libCamData.displayPercentComplete = true;
                            if (exportsEvents[i].device.assigned_gateway) {
                                libCamData.timeZone = exportsEvents[i].device.assigned_gateway.timezone;

                            } else {
                                //console.log(" No DeviceData ");
                            }
                        } else {
                            // console.log("No Device Data ");
                        }

                        libCamData.startTime = that.timeService.getDateOnlyfromUtc(exportsEvents[i].start_time, libCamData.timeZone);
                        let displatStartTime = this.timeService.getLocalTimeforLibrary(exportsEvents[i].start_time, libCamData.timeZone);
                        let displatCreatedTime = this.timeService.getLocalTimeforLibrary(exportsEvents[i].created_time, libCamData.timeZone);
                        libCamData.videoTitle = libCamData.cameraName + ' ' + displatStartTime + '/ Created on :' + displatCreatedTime;
                        libCamData.displayDescription = displatStartTime;
                        //if clip date of current content is alraedy added in the list , append it to the same array
                        //else create a new date add the content.
                        if (lastUpdatedDate == libCamData.startTime) {
                            let LibCameList = that.libDataMapForClipDate[that.libDataMapForClipDate.length - 1].cameraList;
                            LibCameList.push(libCamData);
                            that.libDataMapForClipDate[that.libDataMapForClipDate.length - 1].cameraList = LibCameList;
                            that.libDataMapForClipDate[that.libDataMapForClipDate.length - 1].itemCount = LibCameList.length;
                            if (LibCameList.length > 8) {
                                that.libDataMapForClipDate[that.libDataMapForClipDate.length - 1].cameraShortList = _.slice(LibCameList, 0, 8);
                            } else {
                                that.libDataMapForClipDate[that.libDataMapForClipDate.length - 1].cameraShortList = LibCameList;
                            }

                        }
                        else {
                            if (that.timeService.isFormatedStartDateIsGreater(lastUpdatedDate, libCamData.startTime)) {

                                let libDataDateWise = new LibdataDatewise();
                                libDataDateWise.clipDate = libCamData.startTime;
                                let libDataArray = new Array<LibCamera>();
                                libDataArray.push(libCamData);
                                libDataDateWise.cameraList = libDataArray;
                                libDataDateWise.cameraShortList = libDataArray;
                                libDataDateWise.itemCount = 1;
                                that.libDataMapForClipDate.push(libDataDateWise);
                                lastUpdatedDate = libCamData.startTime;
                            }
                        }
                    }

                    return that.libDataMapForClipDate;
                }

                else {
                    console.log(" getLibraryDataDateCreated _ FAILED ");
                }

            });//.subscribe(result => {this.result = result});
    }

    /**
     * 
     * 
     * @param {string} visibility 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getClipDates(visibility: string) {
        let that = this;
        if (this.waitingForSortByClipResponse == true) {
            this.currentPageNo--;
            return
        }
        if (that.currentPageNo >= this.totalClipDatePageCount) {
            return;
        }
        this.waitingForSortByClipResponse = true;
        this.getLibraryDataSortbyClipDate(this.currentPageNo.toString(), visibility).subscribe((clipDates: any) => {
            let rowCount = 0;
            that.waitingForSortByClipResponse = false;
            if (clipDates.length == 1) {
                that.callNextPage = true;
            }
            else if (clipDates.length == 2) {
                if (clipDates[0].cameraList.length < 5 && clipDates[1].cameraList.length < 5) {
                    that.callNextPage = true;
                }
            }
            if (clipDates.length >= 3) {
                that.callNextPage = false;
            }

            if (that.callNextPage) {
                that.currentPageNo++;
                that.getClipDates(visibility);
            }
            that.loadingSpinnerOn = false;
        });
    }

    /**
     * 
     * 
     * @param {string} visibility 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getCreatedDates(visibility: string) {
        let that = this;
        if (this.waitingForSortByDateResponse == true) {
            this.currentPageNo--;
            return
        }
        if (that.currentPageNo >= this.totalCreatedDatePageCount) {
            return;
        }
        this.waitingForSortByDateResponse = true;
        this.getLibraryDataSortbyDateCreated(this.currentPageNo.toString(), visibility).subscribe((clipDates: any) => {
            this.waitingForSortByDateResponse = false;
            let rowCount = 0;
            if (clipDates.length == 1) {
                that.callNextPage = true;
            }
            else if (clipDates.length == 2) {
                if (clipDates[0].cameraList.length < 5 && clipDates[1].cameraList.length < 5) {
                    that.callNextPage = true;
                }
            }

            if (clipDates.length >= 3) {
                that.callNextPage = false;
            }

            if (that.callNextPage) {
                this.currentPageNo++;
                that.getCreatedDates(visibility);
            }

            this.loadingSpinnerOn = false;
        });
    }

    /**
     * 
     * 
     * @param {string} filterDate 
     * 
     * @memberOf LibraryService
     */
    getClipDateLibData(filterDate: string) {
        let libDataList = _.filter(this.libDataMapForClipDate, function (o) {
            return o.clipDate == filterDate;
        });
        let seeMoreCamList = libDataList[0].cameraList;
        this.datewiseSeeMoreList = seeMoreCamList;
        this.loadingSpinnerOn = false;
        //ToDo:: Paging - get requried data only from seeMoreCamList..
    }

    /**
     * 
     * 
     * @param {string} filterDate 
     * 
     * @memberOf LibraryService
     */
    getCreatedDateLibData(filterDate: string) {
        let libDataList = _.filter(this.libDataMapForCreatedDate, function (o) {
            return o.clipDate == filterDate;
        });
        if (libDataList.length > 0) {
            let seeMoreCamList = libDataList[0].cameraList;
            this.datewiseSeeMoreList = seeMoreCamList;
        }
        this.loadingSpinnerOn = false;
        //ToDo:: Paging - get requried data only from seeMoreCamList..
    }

    /**
     * 
     * 
     * @param {any} exportId 
     * @returns 
     * 
     * @memberOf LibraryService
     */
    getClipCompletionPercentage(exportId) {
        let url = "api/clips/" + exportId;
        let completedPercentage;
        let that = this;
        return this.http
            .get(url, {})
            .map(response => {
                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    completedPercentage = res.data.percent_complete;
                }
                return completedPercentage;
            }
            );
    }

    /**
     * 
     * 
     * @param {any} visibility 
     * 
     * @memberOf LibraryService
     */
    setVisibilityOption(visibility) {
        switch (visibility) {
            case 'ShowAll':
                this.dataVisiblity = Visibility.LIB_SHOWALL;
                this.dataVisiblityDisplay = Visibility.DISPLAY_SHOWALL;
                break;
            case 'Shared':
                this.dataVisiblity = Visibility.LIB_SHARED;
                this.dataVisiblityDisplay = Visibility.DISPLAY_LIB_SHARED;
                break;
            case 'OnlyMe':
                this.dataVisiblity = Visibility.LIB_ONLYME;
                this.dataVisiblityDisplay = Visibility.DISPLAY_LIB_ONLYME;
                break;
        }
    }

    /**
     * 
     * 
     * @param {any} camera 
     * 
     * @memberOf LibraryService
     */
    onImageSelected(camera) {
        if (camera.selected) {
            this.selectedItemCount++;
            this.selectedVideoUrls.push(camera.videoURL)
            this.selectedLibVideos.push(camera);
            this.selectedCameras.push(camera);
            this.downloadBarActive = true;
            this.setCountString();
        }
        else {
            let itemIndex = this.selectedVideoUrls.indexOf(camera.videoURL);
            this.selectedVideoUrls.splice(itemIndex, 1);
            this.selectedLibVideos.splice(itemIndex, 1);
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
        this.selectedLibVideos = null;
        this.selectedItemCount = 0;
        this.downloadBarActive = false;
    }
}
