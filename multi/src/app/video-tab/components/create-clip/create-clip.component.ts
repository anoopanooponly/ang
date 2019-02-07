
/**********************************************************************************
* File Name   :   CreateClipComponent.ts
* Description :   This angular component represents clip creation and related functionality.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MdlSnackbarService } from 'angular2-mdl/components/snackbar/mdl-snackbar.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ElementRef, Renderer, SimpleChanges, ChangeDetectorRef,NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MdlDialogReference, MdlDialogService } from 'angular2-mdl/components/dialog/mdl-dialog.service';

import { Visibility } from './../../../model/visibility';
import { StorageService } from './../../../services/storage.sevice';
import { PlayerService } from './../../../services/player.service';
import { TimeService } from './../../../services/time.service';
import { VideoService } from './../../../services/video.service';
import { DateFormat } from './../../../model/date-format';
import { View } from './../../../model/view';
import { Store } from './../../../model/store';
import { Camera} from './../../../model/camera';

@Component({
  selector: 'create-clip',
  templateUrl: './create-clip.component.html',
  styleUrls: ['./create-clip.component.css'],
 changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateClipComponent {

  private src: any;
  private player;
  private startTime;
  private startUTCTime;
  private endUTCTime;
  private endTime;
  private playInterval = 1; // in minutes. for 1 hr give as 1* 60
  private duration = this.playInterval * 60; // in seconds
  private sessionId;
  stores: Array<Store> = [];
  views: Array<View>;
  private selectedStore;
  private selectedView;
  private mode;
  private cameraList;
  private listObserv;
  private selectedCamera;
  private cameraLoaded = false;
  private showFromCal;
  private showToCal;
  private fromDate;
  private toDate;
  private name;
  private notes;
  private visibleOption = '0';
  private fromampm = "AM";
  private toampm = "AM";
  private submitted = false;
  private fhour;
  private fmin;
  private fsec;
  private thour;
  private tmin;
  private tsec;
  private beginDateObj: DateFormat;
  private endDateObj: DateFormat;
  private isPlaying;
  private dateValidationErr = false;
  private dateValidationMsg;
  private fromoffsetTop;
  private toffsetTop;
  private videoLoaded = true;
  private formValidatorGrp;
  private showDuration = false;
  private formattedDuration = "";
  private nameMaxLength = false;
  private notesMaxLength = false;
  private selectedToDate = "";
  private selectedFromDate = "";
  public defaultCamera:Camera=new Camera();
  private clipState = {
    visibleOption: '1',
    name: '',
    notes: '',
    selectedStore: '',
    selectedView: '',
    selectedCamera: '',
    startDate: null,
    endDate: null,
    src: null,
    selectedFromDate:'',
    selectedToDate:''
  };

  private myDateRangePickerOptionsNormal = {
    dateFormat: 'mmm dd, yyyy',
    showClearButton: true,
    width: '160px', 
    selectionTxtFontSize: '14px'

  };


  @ViewChild('editUserDialog') private dialog;
  /**
   * Creates an instance of CreateClipComponent.
   * 
   * @param {Http} http
   * @param {ElementRef} _el
   * @param {Renderer} renderer
   * @param {VideoService} videoService
   * @param {TimeService} timeService
   * @param {PlayerService} playerService
   * @param {MdlSnackbarService} mdlSnackbarService
   * @param {ActivatedRoute} route
   * @param {MdlDialogService} dialogService
   * @param {FormBuilder} formBuilder
   * @param {StorageService} storageService
   * @param {ChangeDetectorRef} ref
   * @param {NgZone} zone
   * 
   * @memberOf CreateClipComponent
   */
  constructor(private http: Http,  private _el: ElementRef,
   private renderer: Renderer,
    private videoService: VideoService,
    private timeService: TimeService,
    private playerService: PlayerService,
    private mdlSnackbarService: MdlSnackbarService,
    private route: ActivatedRoute,
    private dialogService: MdlDialogService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private ref: ChangeDetectorRef, private zone: NgZone) {
  

    this.src = this.videoService.getSelectedVideoSource();
    if (this.src != null && this.src != 'undefined') {
      this.selectedCamera = this.src.id;
      this.visibleOption = '0';
     
    }
     this.intializeStoreAndView();
   this.restoreState();
 }

/**
 * Set start time and end time
 * 
 * 
 * 
 * @memberOf CreateClipComponent
 */
  formatDates() {
    this.beginDateObj.hour = this.fhour;
    this.beginDateObj.minute = this.fmin;
    this.beginDateObj.second = this.fsec;
    this.beginDateObj.meridiem = this.fromampm;
    this.startUTCTime = this.timeService.convertLocalTimeToUtc(this.beginDateObj, this.src.timezone);

    this.endDateObj.hour = this.thour;
    this.endDateObj.minute = this.tmin;
    this.endDateObj.second = this.tsec;
    this.endDateObj.meridiem = this.toampm;
    this.endUTCTime = this.timeService.convertLocalTimeToUtc(this.endDateObj, this.src.timezone);
  }


 /**
  * This method validate form fields 
  * 
  *
  * @returns false when validation error occurs
  * 
  * @memberOf CreateClipComponent
  */
  validateForm() {
    if (this.name == null || this.name == 'undefined' || this.name === "") {
      return false;
    }
    if (this.name != null && this.name.length > 50) {
      this.nameMaxLength = true;
      return false;
    }
    if (this.notes != null && this.notes.length > 250) {
      this.notesMaxLength = true;
      return false;
    }

    //check camara is offline or not

    let camList = this.cameraList.filter(cam => cam.id == this.selectedCamera);
    if (camList != null && camList.length > 0) {
      if (!camList[0].isOnline) {
        this.dialogService.alert("Cannot create clip for offline camera.");
        return false;
      }
    }
    this.dateValidationErr = false;
    this.dateValidationMsg = "";
    let diff = this.timeService.getTimeDifferenceInSeconds(this.startUTCTime, this.endUTCTime);
    if (diff < 0) {
      this.dateValidationErr = true;
      this.dateValidationMsg = "'From date' should not be greater than 'To date'.";
      return false;
    }
    if (this.timeService.isGreaterThanNow(this.endUTCTime)) {
      this.dateValidationErr = true;
      this.dateValidationMsg = "End date should not be greater than current time.";
      return false;
    }
    return true;
  }


  /**
   * Creates clip for the given period
   * 
   * @returns
   * 
   * @memberOf CreateClipComponent
   */
   createClip() {
   
    this.submitted = true;
    this.formatDates();
    this.nameMaxLength = false;
    this.notesMaxLength = false;
    if (!this.validateForm()) {
      return;
    }

    let diff = this.timeService.getTimeDifferenceInSeconds(this.startUTCTime, this.endUTCTime);
    this.showDuration = false;
    if (Number(diff) / 60 > 3) {
      this.showDuration = true;
      this.formattedDuration = this.timeService.convertSecondsToTimeFormat(diff);
      return;
    }
   this.generateClip();
  }
  
  /**
   * To disable edit time 
   * 
   * 
   * @memberOf CreateClipComponent
   */
  editTime() {
    this.showDuration = false;
  }
 
 /**
  * when continue clip creation button clicked,to enable create clip
  * 
  * @returns
  * 
  * @memberOf CreateClipComponent
  */
 continueClipGeneration() {
    this.submitted = true;

    this.formatDates();
    if (!this.validateForm()) {
      return;
    }
    this.generateClip();
  }


 /**
  * Creates clip 
  * 
  * 
  * @memberOf CreateClipComponent
  */
 generateClip() {
    let that = this;
    let msg = null;

    that.mdlSnackbarService.showSnackbar({
      message: "Clip creation in process.",
      timeout: 1000,
      action: {
        handler: () => {

        },
        text: 'Ok'
      }
    });
    this.playerService.createClip(this.src.uid, this.startUTCTime, this.endUTCTime, this.visibleOption == '1' ? Visibility.CREATE_CLIP_ONLYME : Visibility.CREATE_CLIP_SHARED,this.name,this.notes)
      .subscribe((response) => {
        if (response.status == 200) {
          that.saveStateToLocalStorage();
          msg = "Clip creation in process.";
        } else {
          msg = "Clip creation failed."
        }


      }, () => {

        that.mdlSnackbarService.showSnackbar({
          message: "Error while creating clip.",
          timeout: 2000,
          action: {
            handler: () => {

            },
            text: 'Ok'
          }
        });

      });

    if (this.dialog) {
      this.dialog.dialogRef.hide();
    }
  }
  
/**
 * Shows create clip button clicked
 * 
 *
 * 
 * @memberOf CreateClipComponent
 */
 onDialogShow() {
    this.cameraList = [];
    let that = this;
    this.submitted = false;
    this.nameMaxLength = false;
    this.notesMaxLength = false;
    this.dateValidationErr = false;
    this.dateValidationMsg = "";
    this.showDuration = false;
    this.formattedDuration = "";
    this.isPlaying = false;
    this.name = "";
    this.notes = "";
    this.route.data
      .subscribe((dataStore: any) => {
        that.cameraList = dataStore.gallery;
        that.cameraLoaded = true;
        that.src = that.videoService.getSelectedVideoSource();
        console.log("src",that.src);
        if (that.src != null && that.src != 'undefined') {
          that.selectedCamera = that.src.id;
        }

      });
  if (this.player)
      this.player.destroy();
    this.showFromCal = false;
    this.showToCal = false;

   

    let currTime = this.timeService.getCurrentUTCTime();
    var removeMedia = Clappr.MediaControl.extend({
      get template() { return Clappr.template('<div></div>') }
    });

    var playerElement = document.getElementById("player-wrapper-clip");
    let endUTCTime = this.videoService.getMarkedDates().endDate;
    this.endUTCTime = endUTCTime;
    this.endTime = this.timeService.getLocalTimeFrame(this.endUTCTime, this.src.timezone);
    this.startUTCTime = this.timeService.getPredate(this.endUTCTime, this.playInterval);
    this.startTime = this.timeService.getLocalTimeFrame(this.startUTCTime, this.src.timezone);
    this.restoreFromLocalStorage();
    let timeObj = this.formatTimeToObject(this.startUTCTime);

    this.fhour = timeObj.hour;
    this.fmin = timeObj.minute;
    this.fsec = timeObj.second;
    this.fromampm = timeObj.meridiem;
    this.beginDateObj = timeObj;

    let beginDateString = this.timeService.getDateFormatted(Number(timeObj.day), Number(timeObj.month), Number(timeObj.year));
    this.selectedFromDate = beginDateString;
    
    this.fromDate = beginDateString;

    timeObj = this.formatTimeToObject(this.endUTCTime);
    this.endDateObj = timeObj;
    this.thour = timeObj.hour;
    this.tmin = timeObj.minute;
    this.tsec = timeObj.second;
    this.toampm = timeObj.meridiem;
    this.beginDateObj = timeObj;


    let endDateString = this.timeService.getDateFormatted(Number(timeObj.day), Number(timeObj.month), Number(timeObj.year));
    this.toDate = endDateString;
    this.selectedToDate = endDateString;
    this.player = new Clappr.Player({
      baseUrl: '/vendor/clappr',
      poster: this.src.thumbnailUrl,
      source: "https://yams-r-1-dev-us-east-1.multisight.com:443/test.m3u8",
      mute: false,
      height: 190,
      width: 280,
      flushLiveURLCache: false,
      hideMediaControl: true,
      allowUserInteraction: false,
      chromeless: true,
      mediacontrol: { external: removeMedia },
      plugins: [Clappr.FlasHLS, Clappr.HLS]

    });
    this.player.attachTo(playerElement);
  }



 /**
  * Change time to another format
  * 
  * 
  * @param {any} time
  * @returns parsedtime
  * 
  * @memberOf CreateClipComponent
  */
  formatTimeToObject(time) {
    return this.timeService.getprasedDateAndTime(time, this.src.timezone);
  }
  
 /**
  * To load vedio 
  * 
  * @param {any} firstTime
  * 
  * @memberOf CreateClipComponent
  */
  getVideo(firstTime) {
    let bodyVideo = {
      "type": "hls", "media_server_base_uri": "https://yams-r-1-dev-us-east-1.multisight.com:443",
      "device_id": this.src.uid, "media_server_ipv4": "52.22.88.65"
    }
    var videoHeaders = new Headers();
    let that = this;
    this.http
      .post("api/sessions", bodyVideo)

      .map(response => {
        let token = response.json();

        let status = response.status;

        if (status != 200) {
          console.log('Login failed , Error Code :' + status);
          return null;
        }

        let tock = token.data.token;
        let hlsUri = token.data.uri;
        that.sessionId = token.data.id;
        let videoUrl = that.buildViewURL(hlsUri, tock);
        that.player.load(videoUrl);
      }).subscribe(() => {
        if (!firstTime) {
          if (!that.player.isPlaying()) {
            that.player.play();
          }
       }

      }, () => {
     }, () => {
 });
 }


 /**
  * Create url based on given time tocken
  * 
  * @param {any} hlsUri
  * @param {any} tocken
  * @returns vedio url
  * 
  * @memberOf CreateClipComponent
  */
 buildViewURL(hlsUri, tocken) {

    let videoUrl = hlsUri + "/playlist/index.m3u8?start_time=" + this.startUTCTime + "&data_source_id=" + this.src.id + "&token="
      + tocken + "&include_discontinuity_tag=true&max_bandwidth=1999&throttle=true";
    return videoUrl;
  }


 /**
  * Hides the create clip dialogue
  * 
  * 
  * @memberOf CreateClipComponent
  */
  onDialogHide() {
    this.deleteSession();
    this.name="";
    this.selectedFromDate = "";
    this.selectedToDate = "";
    this.player.destroy();

  }
 
 
 /**
  * Delete the current session
  * 
  * @param {any} [callback=null]
  * 
  * @memberOf CreateClipComponent
  */
 deleteSession(callback = null) {
    if (this.sessionId != null && this.sessionId != 'undefined')
      this.http
        .delete(("api/sessions/" + this.sessionId)).subscribe(() => {
          if (callback)
            callback();
        });
  }

 
  /**
   * Loads the initial store and view values
   * 
   * 
   * 
   * @memberOf CreateClipComponent
   */
  intializeStoreAndView() {
    let that = this;
    this.route.data
      .subscribe((dataStore: any) => {
        that.stores = dataStore.data[0];
        that.views = dataStore.data[1];
      });
  }


 /**
  * To retain state
  * 
  * 
  * @memberOf CreateClipComponent
  */
 restoreState() {
    let that = this;
    this.route.params.subscribe(params => {
      let id: string = '' + params['id'];
      let type: string = '' + params['type'];
      if (type == null && type == 'undefined') {
        type = 'store';
      }
      if (type == 'store') {
        that.mode = '0';
        if (id != null && id != "undefined") {
          that.selectedStore = id;
        } else {
          that.selectedStore = that.stores[0].id;
        }
      } else {
        that.mode = '1';
        if (id != null && id != "undefined") {
          that.selectedView = id;
        } else {
          that.selectedView = that.views[0].id;
        }
      }

    });
  }

  
  /**
   * To load camera of particular store
   * 
   * 
   * @param {string} selectedStore
   * 
   * @memberOf CreateClipComponent
   */
   onStoreChange(selectedStore: string) {
    
    this.loadCameras();
    this.selectedCamera='Select Camera';
 
}

 
  /**
   * To load camera of particular view
   * 
   * 
   * @param {any} newVal
   * 
   * @memberOf CreateClipComponent
   */
    onViewChange(newVal) {

    this.loadCameras();
    this.selectedCamera='Select Camera';
   
  }


 /**
  * This method is used to load camera
  * 
  * 
  * @memberOf CreateClipComponent
  */
  loadCameras() {
    let that = this;
    this.cameraLoaded = false;
    this.listObserv = this.mode == '0' ? this.videoService.getStoreCameras(this.selectedStore) : this.videoService.getViewCamaras(this.selectedView);
    this.listObserv.subscribe((cams) => {
      if (cams.length == 0) {
        let empty_Camera: Camera = new Camera();
        empty_Camera.id = 'no camera';
        empty_Camera.name = 'no camera found';
        cams.push(empty_Camera);
        that.cameraList = '';
        that.cameraList = cams;
      }
      else {
        that.cameraList = cams;
      }
      that.cameraLoaded = true;
      that.zone.run(function () {
        that.ref.markForCheck();
      });

    });
  }
  
  /**
   * To create posters of particular camera
   * 
   * 
   * 
   * @memberOf CreateClipComponent
   */
  onCameraChange() {
    let that = this;
    this.videoLoaded = false;
    let filteredList = this.cameraList.filter((cam) => {
      if (cam.id == that.selectedCamera)
        return true;
      else
        return false;
    });
    this.src = filteredList[0];
    this.createPosterElement();
    this.player.stop();
    this.isPlaying = false;
    this.deleteSession(() => {
      that.getVideo(true);
    });
  }


/**
 *To create posters with high resolution images 
 * 
 * @param {any} [callback=null]
 * @param {any} [startUTCTime=null]
 * 
 * @memberOf CreateClipComponent
 */
 createPosterElement(callback = null, startUTCTime = null) {

    let src = this.playerService.getPlayerLowResolutionThumbnail(this.src.uid, startUTCTime ? startUTCTime : this.timeService.getCurrentUTCTime());
    var image = document.createElement('img');
    image.src = src;
    let that = this;

    image.onload = function () {
      that.videoLoaded = true;

      that.zone.run(function () {
        that.ref.markForCheck();
      });
      that.player.configure({ poster: src });

      if (callback) {
        callback();
      }
    };

    image.onerror = () => {
      that.videoLoaded = true;
      var poster = that.player.getPlugin('poster');
      that.player.configure({ poster: 'assets/img/thumbnail-error-small.png' });
      poster.showPlayButton(false);
      if (callback) {
        callback();
      }
    }
  }


  /**
   * To show calender to select from date
   * 
   * @param {any} event
   * 
   * @memberOf CreateClipComponent
   */
   onFromClick(event) {

    let calImg = document.getElementById('fromCalenderImg');
    this.fromoffsetTop = calImg.getBoundingClientRect().top - 5;
    this.showFromCal = true;
    this.showToCal = false;
    event.stopPropagation();
  }


  /**
   * To show calender of to date
   * 
   * 
   * @param {any} event
   * 
   * @memberOf CreateClipComponent
   */
 onToClick(event) {
    let calImg = document.getElementById('toCalenderImg');
    this.toffsetTop = calImg.getBoundingClientRect().top - 5;
    this.showToCal = true;
    this.showFromCal = false;
    event.stopPropagation();
  }

 
  /**
   * To close the create  clip dialogue
   * 
   * 
   * @memberOf CreateClipComponent
   */
 close() {

    this.restoreFromLocalStorage();
    this.name = "";
    this.showToCal = false;
    this.showFromCal = false;
    if (this.dialog) {
      this.dialog.dialogRef.hide();
    }
  }


  /**
   * To set selected calender from date
   * 
   * @param {any} event
   * 
   * @memberOf CreateClipComponent
   */
  onDateFromchanged(event) {
    let beginDate = event.beginDate;
    this.beginDateObj = beginDate;
    let beginDateString = this.timeService.getDateFormatted(beginDate.day, beginDate.month, beginDate.year);
    this.fromDate = beginDateString;
    this.selectedFromDate = beginDateString;
  }

 
  /**
   *To set selected calender to date 
   * 
   * @param {any} event
   * 
   * @memberOf CreateClipComponent
   */
  onDateTochanged(event) {
    let beginDate = event.beginDate;
    this.endDateObj = beginDate;
    let beginDateString = this.timeService.getDateFormatted(beginDate.day, beginDate.month, beginDate.year);
    this.toDate = beginDateString;
    this.selectedToDate = beginDateString;

  }

 
  /**
   * To play a vedio
   * 
   * 
   * @memberOf CreateClipComponent
   */
   play() {
    this.deleteSession();
    this.getVideo(false);
    this.isPlaying = true;
  }


 /**
  * To stop current vedio
  * 
  * 
  * @memberOf CreateClipComponent
  */
   stop() {
    this.player.stop();
    this.isPlaying = false;
    

  }
 
 
 /**
  *used to refresh by stop playing vedio
  * 
  * 
  * 
  * @memberOf CreateClipComponent
  */
   refresh() {
    this.formatDates();
    if (this.isPlaying) {
      this.player.stop();
    }
    this.createPosterElement(null, this.startUTCTime);
  }


 /**
  * Set visibility to shared
  * 
  * @param {any} val
  * 
  * @memberOf CreateClipComponent
  */
 onVisibleShare(val) {
    this.visibleOption = val;
  }


 /**
  * To set visibility to only me
  * 
  * @param {any} val
  * 
  * @memberOf CreateClipComponent
  */
   onVisibleOnlyMe(val) {
    this.visibleOption = val;
  }

  
  /**
   * To store the local value to session
   * 
   * 
   * @memberOf CreateClipComponent
   */
 saveStateToLocalStorage() {
   
    this.clipState.selectedCamera = this.selectedCamera;
    this.clipState.selectedStore = this.selectedStore;
    this.clipState.selectedView = this.selectedView;
    this.clipState.visibleOption = this.visibleOption;
    this.clipState.startDate = this.startUTCTime;
    this.clipState.endDate = this.endUTCTime;
    this.clipState.selectedFromDate = this.selectedFromDate;
    this.clipState.selectedToDate = this.selectedToDate;

    this.clipState.src = this.src;

    this.storageService.write('clip', JSON.stringify(this.clipState));

  }


  /**
   * To retrive data from session
   * 
   * 
   * 
   * @memberOf CreateClipComponent
   */
 restoreFromLocalStorage() {
    let clip: any = this.storageService.read('clip');
    if (clip != null && clip != 'undefined') {
      let clipState = JSON.parse(clip);
      if (clipState != null) {

        this.selectedCamera = clipState.selectedCamera;
        this.selectedStore = clipState.selectedStore;
        this.selectedView = clipState.selectedView;
        this.visibleOption = clipState.visibleOption;
        this.startUTCTime = clipState.startDate;
        this.endUTCTime = clipState.endDate;
        this.selectedFromDate = clipState.selectedFromDate;
        this.selectedToDate = clipState.selectedToDate;
        this.src = clipState.src;
      }
    }
  }


  /**
   * 
   * 
   * @param {any} e
   * @returns false
   * 
   * @memberOf CreateClipComponent
   */
  onkeydown(e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58)
      || e.keyCode == 8)) {
      return false;
    }
  }


  /**
   * 
   * 
   * @param {SimpleChanges} changes
   * 
   * @memberOf CreateClipComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
  }

}
