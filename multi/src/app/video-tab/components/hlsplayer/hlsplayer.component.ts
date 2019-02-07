import { StorageService } from './../../../services/storage.sevice';

/**********************************************************************************
* File Name   :   HlsplayerComponent.ts
* Description :   This angular component renders the HLS streaming player.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
// **********************************************************************************/
import { DateFormat } from './../../../model/date-format';
import { CookieService } from './../../../services/cookie.service';
import { PlayerService } from './../../../services/player.service';
import { TimeService } from './../../../services/time.service';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { VideoService } from './../../../services/video.service';
import { PlaybackBaseurl } from './../../../model/playback-baseurl';
import { MdlDialogService } from 'angular2-mdl/components/dialog/mdl-dialog.service';
import { MdlSnackbarService } from 'angular2-mdl/components/snackbar/mdl-snackbar.service';
/// <reference path="VideoData.d.ts" />
import {
  Component, ElementRef, OnInit, OnDestroy, Input, HostBinding, trigger, transition,
  animate, style, state, Renderer
} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UICorePlugin, Styler } from 'Clappr';
import AirPlayPlugin from './plugin/newSeekBar';
import NewMediaCtrl from './plugin/MediaController';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';


declare var window: any;
@Component({
  selector: 'hls-player',
  templateUrl: './hlsplayer.component.html',
  styleUrls: ['./hlsplayer.component.scss'],
  animations: [
    trigger('routeAnimation', [
      state('*',
        style({
          opacity: 1,
          //TODO Recheck , if enable calender data becoms unresponsive
          //  transform: 'translateY(0)'
        })
      ),
      transition(':enter', [
        style({
          opacity: 0,
         transform: 'translateY(-100%)'
        }),
        animate('0.5s  ease-in')
      ]),
    ])
  ]
})
export class HlsplayerComponent implements OnInit, OnDestroy {

  private player: any;
  private sessionId;
  private loaded = false;
  @Input() src: any;

  private draggingSeekBar;
  private $seekBarContainer;
  private $seekBarHover;
  private $seekBarLoaded;
  private $seekBarPosition;
  private $poster;
  private $;
  private hoveringOverSeekBar;
  private LEFT_CONST = 2.5;
  private hoverPosition;
  private useActualLiveTime = false;
  private playInterval = 10; // in minutes. for 1 hr give as 1* 60
  private duration = this.playInterval * 60; // in seconds
  private el;
  private isPlaying;
  private sizeChanged = false;
  private seekbarWidth = 896;
  private showPlayerControls;
  private loading = true;

  private LIVE = false;
  private isFullScreen = false;
  private startTime;
  private startUTCTime;
  private endUTCTime;
  private endTime;
  private router;
  private thumbs: Array<any> = [];
  private selectedThumb;
  private $spotlight;
  private thumbnailOpacity = "0";
  private motions = [];
  private exportEvnts = [];
  private recordingEvnts = [];
  private currentSeekPercentage;
  private $dataSpinner;
  private timer = 0;
  private interval;
  private motionloaded = false;
  private currentSeekTime = "live";
  private motionEvntList;
  private selectedCameraName;
  private selectedSiteName;
  private titleDate;
  private playState;
  private prevProgressVal;
  private oldWatchVal;
  private prevBufferVal = 0;
  private progressUpdate;
  private deductFactor = 0;
  private speed = 1;
  private controlOpacity = "1";
  private prevHeight;
  private prevWidth;
  private calSub;
  private motionSub;
  private recordSub;
  private exportSub;
  private TOTAL_PARL_IMGE_FTCH_CNT = 5;
  private enableLocalPlayBack: boolean = true;
  private basePlaybackUrl: any = '';
  private playbackBase: any = new PlaybackBaseurl();
  private connectivityTimer: any;

  @HostBinding('@routeAnimation') get routeAnimation() {
    return true;
  }

  @HostBinding('style.display') get display() {
    return 'block';
  }



  /**
   * Creates an instance of HlsplayerComponent.
   * 
   * @param {Http} http
   * @param {ElementRef} _el
   * @param {VideoService} videoService
   * @param {Router} rout
   * @param {ActivatedRoute} route
   * @param {ActionBarCommunicationService} actionBarCommunicationService
   * @param {TimeService} timeService
   * @param {PlayerService} playerService
   * @param {MdlSnackbarService} mdlSnackbarService
   * @param {CookieService} cookieService
   * @param {MdlDialogService} dialogService
   * 
   * @memberOf HlsplayerComponent
   */
  constructor(private http: Http,
    private _el: ElementRef,

    public videoService: VideoService,
    public rout: Router,
    public route: ActivatedRoute,
    private actionBarCommunicationService: ActionBarCommunicationService,
    private timeService: TimeService,
    private playerService: PlayerService,
    private mdlSnackbarService: MdlSnackbarService,
    private cookieService: CookieService,
    public dialogService: MdlDialogService,
    private storageService: StorageService) {
    this.draggingSeekBar = false;
    this.router = rout;
    this.src = this.videoService.getSelectedVideoSource();
    let localGatewayCheckUrl = "http://" + this.src.gatewayIp + "/hermes/gateway/image?refresh=" + Date.now();
    this.checkLocalConnectivity(localGatewayCheckUrl);
    let that = this;
    this.calSub = this.actionBarCommunicationService.playercalendardata$.subscribe((obj: any) => {
      that.resetTimeAndReloadThumbForPlayer(obj.starttime, obj.endtime, '');
    });
  }

  /**
  * 
  * 
  * @returns
  * 
  * @memberOf HlsplayerComponent
  */
  ngOnInit() {
    let that = this;
    that.loading = true;
    var playerElement = document.getElementById("player-wrapper");
    this.src = this.videoService.getSelectedVideoSource();
    let currTime = this.timeService.getCurrentUTCTime();
    var removeMedia = Clappr.MediaControl.extend({
      get template() {
        return Clappr.template(`
        
        `)
      }
    });
    this.selectedCameraName = this.src.name;
    this.selectedSiteName = this.src.storeName;
    this.thumbs = [];
    // for (var i = 0; i < 104; i++) {
    //   this.thumbs.push({
    //     url: "http://tjenkinson.me/clappr-thumbnails-plugin/assets/thumbnails/thumb_" + (i + 1) + ".jpg",
    //     time: 1 + (i * 2)
    //   });
    // }


    let endUTCTime = this.src.endTime ? this.src.endTime : this.timeService.getCurrentUTCTime();
    if (this.src.startTime != null && this.src.endTime != null) {
      this.duration = this.timeService.getTimeDifferenceInSeconds(this.src.startTime, this.src.endTime);
      this.playInterval = this.duration / 60;
    }
    this.endUTCTime = endUTCTime;
    //  this.titleDate = this.timeService.getLocalTimeforPlayer(this.endUTCTime, this.src.timezone);

    let parsedTitleDate: DateFormat = new DateFormat;
    parsedTitleDate = this.timeService.getprasedDateAndTime(this.endUTCTime, this.src.timezone);

    //this.actionBarCommunicationService.notifyCalendar(parsedTitleDate);
    this.playerService.setPlayerCalendarDate(parsedTitleDate, this.src.timezone);
    this.endTime = this.timeService.getLocalTimeFrame(this.endUTCTime, this.src.timezone);
    this.titleDate = this.timeService.getLocalTimeforPlayer(this.endUTCTime, this.src.timezone);
    this.startUTCTime = this.timeService.getPredate(this.endUTCTime, this.playInterval);
    this.startTime = this.timeService.getLocalTimeFrame(this.startUTCTime, this.src.timezone);
    this.markDates();
    this.loadThumbnails();
    let posterSrc = "";
    posterSrc = that.src.posterUrl;
    this.selectedThumb = this.src.thumbnailUrl;
    that.player = new Clappr.Player({
      baseUrl: '/vendor/clappr',
      poster: posterSrc,
      source: "https://yams-r-1-dev-us-east-1.multisight.com:443/test.m3u8",
      mute: false,
      height: 504,
      width: 896,
      flushLiveURLCache: false,
      hideMediaControl: true,
      mediacontrol: { external: removeMedia },
      plugins: [Clappr.FlasHLS, Clappr.HLS, ClapprStats],

      clapprStats: {
        runEach: 1000, //optional: time in miliseconds for each report default:  5000
        onReport: (metrics) => {
          if (metrics.timers.watch > 0) {
            this.updateProgress(metrics.timers.watch, metrics.timers.buffering);

          }
        }
      },
      events: {

        onError: (evnt) => {
          console.error("player error", evnt);
          if (evnt != null && evnt.error != null && evnt.error.message != null && evnt.error.message.indexOf('Cannot load M3U8') != -1) {
            if (evnt.error.message.indexOf('crossdomain access denied')) {

              this.handleCrossdimainError();
            }
            else {
              this.handleError();
            }

          }
        },
        onReady: () => {
          this.removePlayBtn();
        }
      }
    });
    that.player.attachTo(playerElement);


    that.player.on(Clappr.Events.PLAYER_FULLSCREEN, function (isFullscreen) {
      that.isFullScreen = isFullscreen;

      if (isFullscreen) {
        this.reDrawStrips(window.outerWidth);
      }

    });

    var poster = that.player.getPlugin('poster');
    poster.showPlayButton(false);
    that.addSeekBarControls();
    let playerCtrl: any = document.getElementById("playerTop");
    playerCtrl.scrollIntoView(true);
    Observable.fromEvent(window, 'resize').debounceTime(2000).subscribe((event: any) => {
      if (event.target.innerWidth < 500) {
        if (that.player.playerInfo.currentSize.width >= 300) {
          that.player.resize({ height: 160, width: 220 });
          that.seekbarWidth = 220;
          this.reDrawStrips(220);

        }
      }
      else if (event.target.innerWidth < 600) {
        if (that.player.playerInfo.currentSize.width >= 600) {
          that.player.resize({ height: 160, width: 320 });
          that.seekbarWidth = 320;
          this.reDrawStrips(320);
        }
      }
      else if (event.target.innerWidth < 800) {
        if (that.player.playerInfo.currentSize.width >= 800) {
          that.player.resize({ height: 460, width: 700 });
          that.seekbarWidth = 700;
          this.reDrawStrips(700);
        }
      }
      else if (event.target.innerWidth < 1000) {
        if (that.player.playerInfo.currentSize.width >= 600) {
          that.player.resize({ height: 360, width: 640 });
          that.seekbarWidth = 640;
          this.reDrawStrips(640);
        }
      }
      else {
        if (that.player.playerInfo.currentSize.width <= 896) {
          that.player.resize({ height: 504, width: 896 });
          that.seekbarWidth = 896;
          this.reDrawStrips(896);
        }
      }
    });

    this.loadMotionStrips();
    this.loadExportingEventList();
    this.loadRecordingEventList();

    this.player.on("container:settingsupdate", () => {

    })
  }
  /**
   * To handle error while playing vedio
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  handleError() {
    if (this.isPlaying) {
      this.mdlSnackbarService.showSnackbar({
        message: "An error occurred while playing the video.",
        timeout: 3000,
        action: {
          handler: () => {
            this.player.stop();
            this.play();
          },
          text: 'Retry'
        }
      });
    }
  }
  /**
  * To handel crossdomain error
  * 
  * 
  * 
  * @memberOf HlsplayerComponent
  */
  handleCrossdimainError() {
    if (this.enableLocalPlayBack) {

      this.enableLocalPlayBack = false;
      this.play();
    }
  }



  /**
  * redraw strips
  * 
  * @param {any} width
  * 
  * @memberOf HlsplayerComponent
  */
  reDrawStrips(width) {

    this.seekbarWidth = width;
    this.drawExportingEventList();
    this.drawRecordingEventList();
    this.drawMotionStrips();
  }

  /**
   * 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  ngOnDestroy() {

    this.calSub.unsubscribe();
    this.motionSub.unsubscribe();
    this.recordSub.unsubscribe();
    this.exportSub.unsubscribe();
    this.thumbs = [];
    this.src.expanded = false;
    this.videoService.clearMarkedDates();
    try {
      if (this.player.isPlaying()) {
        this.player.stop();
      }
      this.player.destroy();
    }
    catch (e) {

    }
  }


  /**
   * To load thumbnails
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  loadThumbnails() {
    this.thumbs = [];
    let tnails = this.playerService.getPlayerThumbnailList(this.src.uid, this.startUTCTime, this.duration);
    this.loadThumbnailTocache(0, tnails, this.TOTAL_PARL_IMGE_FTCH_CNT);

  }


  /**
   * To cache the thumbnails
   * 
   * @param {any} i
   * @param {any} tnails
   * @param {any} totalItemsToLoadPerLoop
   * 
   * @memberOf HlsplayerComponent
   */
  loadThumbnailTocache(i, tnails, totalItemsToLoadPerLoop) {
    let loadedCount = 0;
    let that = this;
    var images = new Array();
    var thumbsTemp = [];
    let k = 0;
    while (i < totalItemsToLoadPerLoop && i < tnails.length) {
      images[i] = new Image();
      images[i].src = tnails[i].lowResUrl;
      thumbsTemp[k] = tnails[i];
      images[i].onload = function () {
        loadedCount++;
        if (loadedCount == that.TOTAL_PARL_IMGE_FTCH_CNT) {
          that.thumbs.push(...thumbsTemp);
          that.loadThumbnailTocache(i, tnails, i + that.TOTAL_PARL_IMGE_FTCH_CNT)
        }
      };

      images[i].onerror = function () {
        loadedCount++;
        if (loadedCount == that.TOTAL_PARL_IMGE_FTCH_CNT) {
          that.loadThumbnailTocache(i, tnails, i + that.TOTAL_PARL_IMGE_FTCH_CNT)
        }
      }

      i++;
      k++;
    }
  }

  /**
   * To load motionstrips in player
   * 
   * @param {*} [setSeekbar='normal']
   * 
   * @memberOf HlsplayerComponent
   */
  loadMotionStrips(setSeekbar: any = 'normal') {
    let that = this;
    that.motions = [];
    that.motionloaded = false;
    this.motionSub = this.playerService.getMotionEventList(this.src.uid, this.startUTCTime, this.endUTCTime).subscribe((motionEvnts) => {
      that.motions = motionEvnts;
      that.motionloaded = true;
      that.drawMotionStrips();
      if (setSeekbar == "right") {
        this.setSeekPercentage(this.motions[that.motions.length - 1].right);
        this.currentSeekTime = this.motions[that.motions.length - 1].endTime;
      }
      else if (setSeekbar == "left") {
        this.setSeekPercentage(this.motions[0].left);
        this.currentSeekTime = this.motions[0].startTime;
      }
      if (this.currentSeekTime == 'live') {
        this.titleDate = this.timeService.getLocalTimeforPlayer(this.endUTCTime, this.src.timezone);
      }
      else {

      }

    }, () => {
      that.motionloaded = true;
    });
  }

  /**
   * To draw the loaded motio strips
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  drawMotionStrips() {
    let that = this;
    this.motions.forEach(motion => {

      let leftPosInSec = that.videoService.getTimediff(that.startUTCTime, motion.startTime);
      let widthInSec = that.videoService.getTimediff(motion.startTime, motion.endTime);
      let rightPosInSec = that.videoService.getTimediff(that.startUTCTime, motion.endTime);
      let keyFramePosInSec = that.videoService.getTimediff(that.startUTCTime, motion.keyframeTime);
      motion.left = that.getLeftPositionFromTime(leftPosInSec);
      motion.right = that.getSeekPositionFromTime(rightPosInSec);
      motion.keyFrame = that.getSeekPositionFromTime(keyFramePosInSec);
      motion.width = that.getWidthFromTimeDifference(widthInSec);
    })
  }

  /**
   * To load motionstrips in player for selected date and time
   * 
   * @param {*} start
   * @param {*} end
   * 
   * @memberOf HlsplayerComponent
   */
  loadMotionStripsForSelectedRange(start: any, end: any) {
    let setSeekbar: any = 'normal'
    this.startUTCTime = start;
    this.endUTCTime = end;
    let that = this;
    that.motions = [];
    that.motionloaded = true;
    this.motionSub = this.playerService.getMotionEventList(this.src.uid, this.startUTCTime, this.endUTCTime).subscribe((motionEvnts) => {
      that.motions = motionEvnts;
      that.motionloaded = true;
      that.motions.forEach(motion => {
        let leftPosInSec = that.videoService.getTimediff(that.startUTCTime, motion.startTime);
        let widthInSec = that.videoService.getTimediff(motion.startTime, motion.endTime);
        let rightPosInSec = that.videoService.getTimediff(that.startUTCTime, motion.endTime);
        let keyFramePosInSec = that.videoService.getTimediff(that.startUTCTime, motion.keyframeTime);
        motion.left = that.getLeftPositionFromTime(leftPosInSec);
        motion.right = that.getSeekPositionFromTime(rightPosInSec);
        motion.keyFrame = that.getSeekPositionFromTime(keyFramePosInSec);
        motion.width = that.getWidthFromTimeDifference(widthInSec);
      })

      if (setSeekbar == "right") {
        this.setSeekPercentage(this.motions[that.motions.length - 1].right);
        this.currentSeekTime = this.motions[that.motions.length - 1].endTime;
      } else if (setSeekbar == "left") {
        this.setSeekPercentage(this.motions[0].left);
        this.currentSeekTime = this.motions[0].startTime;
      }
      let newArr = that.playerService.getMotionThumbnailList(that.src.uid, that.motions);
      that.thumbs = [].concat(newArr, that.thumbs);
    }, () => {
      that.motionloaded = true;
    });
  }


  /**
   * 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  loadExportingEventList() {
    let that = this;
    this.exportSub = this.playerService.getExportingEventList(this.src.uid, this.startUTCTime, this.endUTCTime).subscribe((exportEvnts) => {
      that.exportEvnts = exportEvnts;
      that.drawExportingEventList();
    }, () => {
      console.log('Error in loadExportingEventList');
    });

  }

  /**
   * To draw the loaded expoting event list in player
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  drawExportingEventList() {
    this.exportEvnts.forEach(exportEvnt => {

      let leftPosInSec = this.videoService.getTimediff(this.startUTCTime, exportEvnt.startTime);
      let widthInSec = this.videoService.getTimediff(exportEvnt.startTime, exportEvnt.endTime);
      exportEvnt.left = this.getLeftPositionFromTime(leftPosInSec);
      exportEvnt.width = this.getWidthFromTimeDifference(widthInSec);
    })
  }

  /**
   * To load recorded events list in player
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  loadRecordingEventList() {
    let that = this;
    let leftPosInSec;
    let widthInSec;
    this.recordSub = this.playerService.getRecordingEventList(this.src.uid, this.startUTCTime, this.endUTCTime).subscribe((recordingEvnts) => {
      that.recordingEvnts = recordingEvnts;
      that.drawRecordingEventList();
    }, () => {
      console.log('Error in loadExportingEventList');
    });

  }


  /**
   * To draw the loaded recording event list
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  drawRecordingEventList() {

    let that = this;
    let leftPosInSec;
    let widthInSec;
    let i = 0;

    this.recordingEvnts.forEach(recordingEvnt => {
      if (i == that.recordingEvnts.length - 1) {
      }
      if (that.timeService.isStartTimeExceedEndTime(that.startUTCTime, recordingEvnt.startTime)) {
        leftPosInSec = 0;
      } else {
        leftPosInSec = that.videoService.getTimediff(that.startUTCTime, recordingEvnt.startTime);
      }
      if (recordingEvnt.endTime === null) {
        recordingEvnt.endTime = that.endUTCTime;
      }
      if (that.timeService.isStartTimeExceedEndTime(recordingEvnt.endTime, that.endUTCTime)) {
        recordingEvnt.endTime = that.endUTCTime;
      }
      if (that.timeService.isStartTimeExceedEndTime(that.startUTCTime, recordingEvnt.startTime)) {
        recordingEvnt.startTime = that.startUTCTime;
      }
      widthInSec = that.videoService.getTimediff(recordingEvnt.startTime, recordingEvnt.endTime);
      recordingEvnt.left = that.getLeftPositionFromTime(leftPosInSec);
      recordingEvnt.width = that.getWidthFromTimeDifference(widthInSec);
      i++;
    })
  }




  /**
   * Create session and loads vedio 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  getVideo() {
    let localPlayback = false;
    let settings: any = this.storageService.read('Settings');//this.cookieService.getCookiePlayBacklocal();
    if (settings != null && settings != 'undefined') {
      let set = JSON.parse(settings);
      if (set != null) {
        localPlayback = set.playBack;
      }
    }
    let localConnectivity = this.playerService.getLocalConnectivityStatus();
    if (localPlayback && this.enableLocalPlayBack && localConnectivity) {
      let localPlaybackUrl = "http://" + this.src.gatewayIp + "/hermes/gateway/id";

      this.playerService.getLocalPlaybackStreamingUrl(localPlaybackUrl)
        .subscribe(playbackBase => {
          if ((playbackBase == null) || (playbackBase == undefined)) {
            this.playbackBase = this.playerService.getYamsBaseUrl();
          } else
            this.playbackBase = playbackBase;
          if (this.playbackBase.baseUrl == null) {
            this.playbackBase = this.playerService.getYamsBaseUrl();
          }
          this.createStreamingSessionAndPlay();
        },
        error => {
          this.playbackBase = this.playerService.getYamsBaseUrl();
          this.createStreamingSessionAndPlay();
        });

    }
    else {
      this.playbackBase = this.playerService.getYamsBaseUrl();
      this.createStreamingSessionAndPlay();
    }

  }
  /**
   * To Update the progress bar while playing
   * 
   * @param {any} timeInMs
   * @param {any} bufferVal
   * @returns
   * 
   * @memberOf HlsplayerComponent
   */
  updateProgress(timeInMs, bufferVal) {
    if (this.LIVE) {
      this.titleDate = this.timeService.addMilliSecondsToUtc(this.endUTCTime, timeInMs, this.src.timezone);
    }
    else {
      this.reCalulateHoverPositionBasedOnPercentage();
      if (this.hoverPosition == 1) {
        this.titleDate = this.timeService.addMilliSecondsToUtc(this.endUTCTime, timeInMs, this.src.timezone);
      }
      else {
        this.titleDate = this.timeService.getLocalTimeforPlayer(this.getActualtimeSinceStart(), this.src.timezone);
      }

    }
    let state = this.player.core.mediaControl.container.playback._currentState;
    if (state === "IDLE" || state === "PAUSED" || state === "PAUSED_BUFFERING") {
      return;
    }
    if (!this.isPlaying || this.LIVE || this.currentSeekPercentage >= 100) {
      return;
    }
    if (timeInMs === this.oldWatchVal) {
      this.progressUpdate = true;
      return;
    }

    if (this.progressUpdate) {
      let newSeekPer = ((timeInMs / 1000) / this.duration) * 100;
      this.deductFactor += (newSeekPer - this.currentSeekPercentage) * (100 / this.duration) * 1000;
      this.progressUpdate = false;
    }
    timeInMs = timeInMs - this.deductFactor;
    this.oldWatchVal = timeInMs;
    let prevVal = Number(this.prevProgressVal);
    let timeInSec = 0;
    if (this.speed > 1) {
      prevVal = prevVal / this.speed;
    }
    if (prevVal > 0) {
      timeInSec = (((timeInMs / 1000) / 60) + prevVal) * 60;
    } else {
      timeInSec = (timeInMs / 1000);
    }
    this.moveSeekBarOnTimeUpdate(timeInSec);
  }

  /**
   * To set new interval while playing
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  setNewInterval() {
    let that = this;
    this.interval = setInterval(function () {
      if (that.player.core.mediaControl.container.playback._currentState != "IDLE" && (that.playState == 0 || that.playState == 1)) {
        let incrementPerctageVal = (100 / that.duration);
        that.setSeekPercentage(that.currentSeekPercentage + incrementPerctageVal, true);
      }
    }, 900);
  }


  /**
  * To move the seekbar pointer to the given time
  * 
  * @param {any} time
  * 
  * @memberOf HlsplayerComponent
  */
  moveSeekBarToGivenTime(time) {
    let timeInSec = this.timeService.getTimeDifferenceInSeconds(this.startUTCTime, time);
    this.moveSeekBarOnTimeUpdate(timeInSec);
    this.reCalulateHoverPositionBasedOnPercentage();
    let val: any = this.getSeekedTime();
    this.prevProgressVal = (val * 100) / 100;
  }


  /**
    *To move seekbar pointer postion when time get updated 
    * 
    * @param {any} time
    * 
    * @memberOf HlsplayerComponent
    */
  moveSeekBarOnTimeUpdate(time) {
    if (!this.LIVE) {
      let movePercentage = (time / this.duration) * 100;
      let newSeek = movePercentage;
      this.setSeekPercentage(newSeek * this.speed, true);
    }
  }

  /**
   * To add controls to seekbar
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  addSeekBarControls() {
    this.el = this._el.nativeElement;
    let playerCtrl: any = document.getElementById("playground");
    let elm1 = this.el.querySelector(".media-control-new");
    playerCtrl.style.width = elm1.clientWidth;
    this.$seekBarContainer = this.el.querySelector('.bar-container[data-seekbar]');
    this.$dataSpinner = this.el.querySelector('.spinner-three-bounce[data-spinner]');
    this.$poster = this.el.querySelector('.player-poster[data-poster]');
    this.$seekBarHover = this.el.querySelector('.bar-hover[data-seekbar]');
    this.$seekBarLoaded = this.el.querySelector('.bar-fill-1[data-seekbar]');
    this.$seekBarPosition = this.el.querySelector('.bar-fill-2[data-seekbar]');
    this.$spotlight = this.el.querySelector('.spotlight');
    this.$ = this.el.querySelector('.bar-scrubber[data-seekbar]');
    let obj = this.el.querySelector('.container[data-container]');
  }

  /**
   * To add the vedio poster to the player
   * 
   * @param {any} [callback=null]
   * @returns
   * 
   * @memberOf HlsplayerComponent
   */
  createPosterElement(callback = null) {
    if (this.draggingSeekBar) {
      return;
    }
    this.showSpinner();
    let src = this.playerService.getPlayerHighResolutionThumbnail(this.src.uid, this.getActualtimeSinceStart());
    var image = document.createElement('img');
    image.src = src;
    let that = this;
    var poster = that.player.getPlugin('poster');
    poster.showPlayButton(false);
    try {
      image.onload = function () {
        that.hideSpinner();
        that.player.configure({ poster: src });
        if (poster != null && poster.el != null) {
          poster.el.style.display = 'block';
        }
        that.el.querySelector('.player-poster').style.display = 'block';

        if (callback) {
          callback();
        }
      };

      image.onerror = () => {
        that.hideSpinner();
        var poster = that.player.getPlugin('poster');
        poster.showPlayButton(false);
        if (callback) {
          callback();
        }
      }
    } catch (e) {
      console.error("Error creating poster", e);
    }
  }


  /**
   * 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  removePlayBtn() {
    var poster = this.player.getPlugin('poster');
    poster.showPlayButton(false);
  }

  /**
    * 
    * 
    * @param {any} hlsUri
    * @param {any} tock
    * @returns
    * 
    * @memberOf HlsplayerComponent
    */
  buildViewURL(hlsUri, tock) {
    this.reCalulateHoverPositionBasedOnPercentage();
    let timeSinceStart = this.getActualtimeSinceStart();

    if (this.LIVE) {
      timeSinceStart = "now";
    }
    if (this.src.uploadKbps == null) {
      this.src.uploadKbps = '1999';//defualt BW
    }
    let videoUrl = hlsUri + "/playlist/index.m3u8?start_time=" + timeSinceStart + "&data_source_id=" + this.src.id + "&token="
      + tock + "&include_discontinuity_tag=true&max_bandwidth=" + this.src.uploadKbps + "&throttle=true" + (this.speed > 1 ? "&speed=" + this.speed : "");
    return videoUrl;
  }

  /**
   * 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  ngAfterViewInit() {

    if (this.src.playerSeekBarTime !== null && this.src.playerSeekBarTime !== 'undefined') {
      this.moveSeekBarToGivenTime(this.src.playerSeekBarTime);
      this.reCalulateHoverPositionBasedOnPercentage();


      this.currentSeekTime = this.getActualtimeSinceStart();

      this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);

    } else {
      this.setSeekPercentage(100, true);
      this.reCalulateHoverPositionBasedOnPercentage();
    }
   // this.createPosterElement();
  }

  /**
  * To enble dragging of seekbar pointer  on mouse drag 
  * 
  * @param {any} event
  * 
  * @memberOf HlsplayerComponent
  */
  startSeekDrag(event) {
    this.draggingSeekBar = true
    let elm1 = this.el.querySelector(".media-control-new");
    elm1.classList.add('dragging')
    this.$seekBarPosition.classList.add('media-control-notransition')
    this.$.classList.add('media-control-notransition')
    this.$seekBarLoaded.classList.add('media-control-notransition')

    this.updateDrag(event);
    if (event) {
      event.preventDefault()
    }
  }

  /**
    * To update the seekbar pointer on mouse drag
    * 
    * @param {any} event
    * 
    * @memberOf HlsplayerComponent
    */
  updateDrag(event) {
    if (this.draggingSeekBar) {
      event.preventDefault()
      const offsetX = event.pageX - (this.getOffsetLeft() - this.LEFT_CONST)
      let pos = offsetX / this.$seekBarContainer.offsetWidth * 100
      pos = Math.min(100, Math.max(pos, 0))
      this.setSeekPercentage(pos)
    }
  }

  /**
   * Calculate the seek percentage  
   * 
   * @param {any} value
   * @param {boolean} [first=false]
   * 
   * @memberOf HlsplayerComponent
   */
  setSeekPercentage(value, first = false) {
    value = Math.max(Math.min(value, 100.0), 0)
    this.$seekBarPosition.classList.remove('media-control-notransition')
    this.$.classList.remove('media-control-notransition')
    this.$seekBarPosition.style.width = `${value}%`;
    this.currentSeekPercentage = value;
    this.$.style.left = `${value}%`;
    if (!first) {
      this.notifyGallery();
    }
  }

  /**
    *Notifies the gallery when new seek percentage is calculated 
    * 
    * 
    * 
    * @memberOf HlsplayerComponent
    */
  notifyGallery() {
    if (this.draggingSeekBar) {
      this.titleDate = this.timeService.getLocalTimeforPlayer(this.getActualtimeSinceStart(), this.src.timezone);
      return;
    }
    if (this.player.isPlaying()) {
      this.player.stop();
      this.isPlaying = false;
    }
    this.reCalulateHoverPositionBasedOnPercentage();
    this.currentSeekTime = this.getActualtimeSinceStart();
    this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
    this.actionBarCommunicationService.process(this.getActualtimeSinceStart(), this.startUTCTime, this.endUTCTime, this.src.id);
  }



  /**
   * To stop drag event
   * 
   * @param {any} event
   * 
   * @memberOf HlsplayerComponent
   */
  stopDrag(event) {

    if (this.draggingSeekBar) {
      this.seek(event)
    }
    let elm1 = this.el.querySelector(".media-control-new");
    elm1.classList.remove('dragging')
    this.$seekBarLoaded.classList.remove('media-control-notransition')
    this.$seekBarPosition.classList.remove('media-control-notransition')
    this.$.classList.remove('media-control-notransition')
    this.draggingSeekBar = false

  }

  /**
   * 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  mouseoutSeekBar() {
    this.thumbnailOpacity = "0";
  }


  /**
   * 
   * 
   * @param {any} event
   * @returns false
   * 
   * @memberOf HlsplayerComponent
   */
  seek(event) {
    const offsetX = event.pageX - (this.getOffsetLeft() + this.LEFT_CONST)
    let pos = offsetX / this.$seekBarContainer.offsetWidth * 100
    pos = Math.min(100, Math.max(pos, 0))

    this.setSeekPercentage(pos);
    this.prevProgressVal = this.getSeekedTime() + 0;
    this.LIVE = false;
    this.createPosterElement();
    return false
  }

  /**
   * Loads the high resolution image for current time 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  setPosterForCurrentTime() {
    let url = this.playerService.getPlayerHighResolutionThumbnail(this.src.uid, this.getActualtimeSinceStart());
    this.player.configure({ poster: url });

  }

  /**
  * set seek bar pointer while dragging
  * 
  * @param {any} event
  * 
  * @memberOf HlsplayerComponent
  */
  mousemoveOnSeekBar(event) {
    if (this.draggingSeekBar) {
      this.seek(event)
    }
    const offsetX = event.pageX - (this.getOffsetLeft() + this.LEFT_CONST);
    this.$seekBarHover.style.left = `${offsetX}px`;
    this.showTime(event);
    this.thumbnailOpacity = "1";
    this.updateSpotlightThumb();

  }


  /**
   * 
   * 
   * @param {any} event
   * @returns
   * 
   * @memberOf HlsplayerComponent
   */
  showTime(event) {
    this.hoveringOverSeekBar = true
    this.calculateHoverPosition(event)
    let obj = this.getSeekTime();
    const currentDuration = this.formatTime(obj.seekTime, false)

    return currentDuration;
  }


  /**
   * Calculate duration from seek time
   * 
   * @returns  currentDuration
   *
   * @memberOf HlsplayerComponent
   */
  getSeekedTime() {
    let obj = this.getSeekTime();
    // TODO get seeked time in seconds. Add that to start time
    const currentDuration = this.formatTime(obj.seekTime, false)
    return currentDuration;
  }


  /**
    * 
    * 
    * 
    * @memberOf HlsplayerComponent
    */
  hideTime() {
    this.hoveringOverSeekBar = false

  }


  /**
   * Calculate left positon 
   * 
   * @returns rect.left
   * 
   * @memberOf HlsplayerComponent
   */
  getOffsetLeft() {
    if (this.isFullScreen) {
      return 0;
    }
    let element = document.getElementById("player-wrapper");
    let rect = element.getBoundingClientRect();
    return rect.left;

  }

  /**
    * 
    * 
    * @param {any} event
    * 
    * @memberOf HlsplayerComponent
    */
  calculateHoverPosition(event) {

    const offset = event.pageX - (this.getOffsetLeft() + this.LEFT_CONST)
    // proportion into the seek bar that the mouse is hovered over 0-1
    this.hoverPosition = Math.min(1, Math.max(offset / this.$seekBarContainer.offsetWidth, 0))
  }


  /**
    * Calculate the current seek time
    * 
    * @returns seektime
    * 
    * @memberOf HlsplayerComponent
    */
  getCurrentSeekTime() {
    let obj = this.getSeekTime();
    return obj.seekTime;
  }

  /**
  * Calculate the seek time from seek pointer postion
  * 
  * @returns time
  * 
  * @memberOf HlsplayerComponent
  */
  getSeekTime() {
    let seekTime: any, secondsSinceMidnight: any
    if (this.useActualLiveTime) {
      let d = new Date(new Date().getTime()), e: any = new Date(d);
      secondsSinceMidnight = (e - d.setHours(0, 0, 0, 0)) / 1000
      seekTime = (secondsSinceMidnight - this.duration) + (this.hoverPosition * this.duration)
      if (seekTime < 0) {
        seekTime += 86400
      }
    } else {
      seekTime = this.hoverPosition * this.duration
    }
    return { seekTime, secondsSinceMidnight }
  }



  /**
   * Change the time value to required format
   * 
   * @param {*} time
   * @param {*} paddedHours
   * @returns
   * 
   * @memberOf HlsplayerComponent
   */
  formatTime(time: any, paddedHours: any) {
    if (!isFinite(time)) {
      return '--:--'
    }
    time = time * 1000
    time = Math.round((time / 1000))
    return '' + time / 60;

  }


  /**
  * To play the loaded vedio
  * 
  * 
  * @memberOf HlsplayerComponent
  */
  play() {
    this.LIVE = false;
    this.deleteSession();
    this.getVideo();
    this.showSpinner();
    this.isPlaying = true;
  }

  /**
   * Stops the currentplayer vedio
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  stop() {
    this.LIVE = false;
    this.reCalulateHoverPositionBasedOnPercentage();
    this.player.pause();
    this.isPlaying = false;
    let that = this;
    this.prevProgressVal = this.getSeekedTime() + 0;
  }


  /**
    * Plays the live vedio
    * 
    * 
    * @memberOf HlsplayerComponent
    */
  gotoLive() {
    this.LIVE = true;
    this.showSpinner();
    this.isPlaying = true;
    this.setSeekPercentage(100);
    this.deleteSession();
    this.resetTimeAndReloadThumb(0, 0, 'gotolive');
    this.getVideo();
  }



  /**
  * 
  * 
  * 
  * @memberOf HlsplayerComponent
  */
  exitHandler() {
    let doc: any = document;
    let fullScreen = (doc.webkitIsFullScreen !== 'undefined' && doc.webkitIsFullScreen) || (doc.mozFullScreen !== 'undefined' && doc.mozFullScreen) ||
      (doc.msFullscreenElement != 'undefined' && doc.msFullscreenElement);
    if (!fullScreen) {
      this.isFullScreen = false;
      let height = this.prevHeight;
      let width = this.prevWidth;
      this.player.resize({ height, width });
      this.reDrawStrips(width);
      let doc: any = null;
      doc = document;
      if (doc.exitFullscreen) {
        doc.exitFullscreen()
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen()
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen()
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen()
      }
    }

  }

  /**
   * Changes the player screen to fullscreen
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  gotoFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    let that = this;

    document.addEventListener('webkitfullscreenchange', () => {
      that.exitHandler();
    }, false);
    document.addEventListener('mozfullscreenchange', () => {
      that.exitHandler();
    }, false);
    document.addEventListener('fullscreenchange', () => {
      that.exitHandler();
    }, false);
    document.addEventListener('MSFullscreenChange', () => {
      that.exitHandler();
    }, false);

    let element: any = null;
    let width;
    if (this.isFullScreen) {
      this.prevHeight = this.player.playerInfo.currentSize.height;
      this.prevWidth = this.player.playerInfo.currentSize.width;
      let height = window.outerHeight;
      width = window.outerWidth;
      this.player.resize({ height, width });
      element = document.getElementById("playerContainer");
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        this.player.core.mediaControl.toggleFullscreen();
      }
      else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.querySelector && element.querySelector('video') && element.querySelector('video').webkitEnterFullScreen) {
        element.querySelector('video').webkitEnterFullScreen()
      }
    }
    else {
      let height = this.player.playerInfo.previousSize.height;
      width = this.player.playerInfo.previousSize.width;
      this.player.resize({ height, width });
      let doc: any = null;
      doc = document;
      if (doc.exitFullscreen) {
        doc.exitFullscreen()
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen()
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen()
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen()
      }
    }
    this.reDrawStrips(width);
  }

  /**
   * Deletes the current session
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  deleteSession() {
    if (this.sessionId != null && this.sessionId != 'undefined')
      this.http
        .delete(("api/sessions/" + this.sessionId)).subscribe();
  }

  /**
   * 
   * 
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  updateSpotlightThumb() {

    if (this.thumbs.length <= 0) {
      return;
    }

    let hoverTime = this.getHoverTime();
    // determine which thumbnail applies to the current time
    var thumbIndex = this.getThumbIndexForTime(this.getActualtimeSinceStart());
    var thumb = this.thumbs[thumbIndex]

    // update thumbnail
    var $spotlight = this.$spotlight

    this.selectedThumb = thumb;
    var elWidth = 100;
    var thumbWidth = $spotlight.offsetWidth
    var spotlightXPos = (100 * this.hoverPosition);
    // adjust so the entire thumbnail is always visible
    spotlightXPos = Math.max(Math.min(spotlightXPos), 0)
    if (this.isFullScreen) {
      if (spotlightXPos > 3 && spotlightXPos < 93) {
        spotlightXPos = spotlightXPos - 3;
      }
      else if (spotlightXPos > 93) {
        spotlightXPos = spotlightXPos - 5;
      }
    }
    else {
      if (spotlightXPos > 3 && spotlightXPos < 93) {
        if (spotlightXPos > 3 && spotlightXPos < 10) {
          spotlightXPos = spotlightXPos - 5;
        }
        else {
          spotlightXPos = spotlightXPos - 6;
        }
      }
      else if (spotlightXPos > 93) {
        spotlightXPos = spotlightXPos - 7;
      }
    }

    this.$spotlight.style.left = `${spotlightXPos}%`;
  }


  /**
   * Calculate mouse over time
   * 
   * @returns hovertime
   * 
   * @memberOf HlsplayerComponent
   */
  getHoverTime() {
    let hoverTime = this.getSeekedTime();
    return hoverTime;
  }

  /**
     * 
     * 
     * @param {any} time
     * @returns minIndex
     * 
     * @memberOf HlsplayerComponent
     */
  getThumbIndexForTime(time) {
    var thumbs = this.thumbs;
    if (thumbs.length === 0) {
      return -1;
    }
    var min = 1500; //some random number
    var minIndex = 0;
    for (var i = 1; i < thumbs.length; i++) {
      let thumb = thumbs[i];
      let newMin = this.videoService.getTimediff(thumb.startTime, time)
      if (newMin < 0)
        newMin = this.videoService.getTimediff(time, thumb.startTime)
      if (newMin < min) {
        minIndex = i;
        min = newMin;
      }
    }
    return minIndex;
  }


  /**
    * Calculates mouse over position based on seek percentage
    * 
    * 
    * @memberOf HlsplayerComponent
    */
  reCalulateHoverPositionBasedOnPercentage() {
    this.hoverPosition = this.currentSeekPercentage / 100;

  }

  /**
   * To get a random value
   * 
   * @returns random value
   * 
   * @memberOf HlsplayerComponent
   */
  getRandom() {
    return Math.round(Math.random() * (45));
  }

  /**
   * To close the player
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  closePlayer() {
    this.src.expanded = false;
    this.router.navigate(["../"], { relativeTo: this.route });
    this.deleteSession();
    this.videoService.setSelectedVideoSource(null);
    this.actionBarCommunicationService.process("closed");
    this.actionBarCommunicationService.action("false");
  }

  /**
   * Calculate the left position based on seek time
   * 
   * @param {any} seektime
   * @returns seekPercentage
   * 
   * 
   * @memberOf HlsplayerComponent
   */
  getLeftPositionFromTime(seektime) {
    let time = seektime * 1000;
    time = time / 1000;
    let seekPercentage = (time / this.duration) * 100;
    return seekPercentage;
  }

  /**
    * Calculate seek position from seek time
    * 
    * @param {any} seektime
    * @returns seekPercentage
    * 
    * @memberOf HlsplayerComponent
    */
  getSeekPositionFromTime(seektime) {
    let time = seektime * 1000;
    time = time / 1000;
    let seekPercentage = (time / this.duration) * 100;
    return seekPercentage;
  }



  /**
 * Calculates width from difference between start and endtime
 * 
 * @param {number} [timediffInSec=5]
 * @returns
 * 
 * @memberOf HlsplayerComponent
 */
  getWidthFromTimeDifference(timediffInSec = 5) {
    let multiplier = this.seekbarWidth / this.duration;
    let totalWidthInPx = multiplier * timediffInSec;
    return totalWidthInPx;
  }

  /**
   * Get previous motion when previous button clicked
   * 
   * @returns
   * 
   * @memberOf HlsplayerComponent
   */
  prevMotion() {
    if (this.currentSeekTime == 'live') {
      this.currentSeekTime = this.endUTCTime;
    }

    this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
    if (this.motions.length < 1) {
      this.moveToPreviousTimeLine();
      return;
    }
    if (this.timeService.isStartTimeEqualOrExceedEndTime(this.motions[0].startTime, this.currentSeekTime)) {
      this.moveToPreviousTimeLine();
      return;

    }
    for (let i = this.motions.length - 1; i >= 0; i--) {
      if (this.timeService.isStartTimeExceedEndTime(this.currentSeekTime, this.motions[i].endTime)) {
        if (this.motions[i].right) {
          this.setSeekPercentage(this.motions[i].right);
          this.reCalulateHoverPositionBasedOnPercentage();
          this.prevProgressVal = this.getSeekedTime() + 0;
          this.currentSeekTime = this.motions[i].endTime;
          this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
          this.createPosterElement();
          break;
        }
      } else if (this.timeService.isStartTimeExceedEndTime(this.currentSeekTime, this.motions[i].keyframeTime)) {
        if (this.motions[i].keyFrame) {
          this.setSeekPercentage(this.motions[i].keyFrame);
          this.reCalulateHoverPositionBasedOnPercentage();
          this.currentSeekTime = this.motions[i].keyframeTime;
          this.prevProgressVal = this.getSeekedTime() + 0;
          this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
          this.createPosterElement();
          break;
        }
      } else if (this.timeService.isStartTimeExceedEndTime(this.currentSeekTime, this.motions[i].startTime)) {
        if (this.motions[i].left == 0) {
          this.setSeekPercentage(0.1);
        } else {
          this.setSeekPercentage(this.motions[i].left);
        }
        this.reCalulateHoverPositionBasedOnPercentage();
        this.prevProgressVal = this.getSeekedTime() + 0;
        this.currentSeekTime = this.motions[i].startTime;
        this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
        this.createPosterElement();
        break;
      }
    }
  }
  /**
   * Move to next motion when next motion button clicked
   * 
   * @returns
   * 
   * @memberOf HlsplayerComponent
   */
  nextMotion() {
    if (this.currentSeekTime == 'live') {
      this.currentSeekTime = this.endUTCTime;
    }
    this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
    if (this.motions.length < 1) {
      let startUTC;
      let endUTC;
      if (this.timeService.getTimediffinMinute(this.timeService.getCurrentUTCTime(), this.endUTCTime) < this.playInterval) {
        endUTC = this.timeService.getCurrentUTCTime();
        startUTC = this.timeService.getPredate(startUTC, this.playInterval);
      } else {
        startUTC = this.endUTCTime;
        endUTC = this.timeService.getPostDate(startUTC, this.playInterval);
      }
      this.resetTimeAndReloadThumb(startUTC, endUTC, 'custom');
      return;
    }
    if (this.timeService.isStartTimeEqualOrExceedEndTime(this.currentSeekTime, this.motions[this.motions.length - 1].endTime)) {
      this.moveToNextTimeLine();
      return;
    }

    for (let i = 0; i < this.motions.length; i++) {
      if (this.timeService.isStartTimeExceedEndTime(this.motions[i].startTime, this.currentSeekTime)) {
        if (this.motions[i].left) {
          this.setSeekPercentage(this.motions[i].left);
          this.reCalulateHoverPositionBasedOnPercentage();
          this.currentSeekTime = this.motions[i].startTime;
          this.prevProgressVal = this.getSeekedTime() + 0;
          this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
          this.createPosterElement();
          break;
        }
      } else if (this.timeService.isStartTimeExceedEndTime(this.motions[i].keyframeTime, this.currentSeekTime)) {
        if (this.motions[i].keyFrame) {
          this.reCalulateHoverPositionBasedOnPercentage();
          this.setSeekPercentage(this.motions[i].keyFrame);

          this.currentSeekTime = this.motions[i].keyframeTime;
          this.prevProgressVal = this.getSeekedTime() + 0;
          this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
          this.createPosterElement();
          break;
        }

      } else if (this.timeService.isStartTimeExceedEndTime(this.motions[i].endTime, this.currentSeekTime)) {

        if (this.motions[i].right) {
          this.reCalulateHoverPositionBasedOnPercentage();
          this.setSeekPercentage(this.motions[i].right);
          this.currentSeekTime = this.motions[i].endTime;
          this.prevProgressVal = this.getSeekedTime() + 0;
          this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
          this.createPosterElement();
          break;
        }
      }
    }
  }

  /**
   * Calculate seekPercentage from motion left positon
   * 
   * @param {any} motion
   * 
   * @memberOf HlsplayerComponent
   */
  onMotionClick(motion) {
    this.setSeekPercentage(motion.left);
  }

  /**
   * Calculate post date from start date
   * 
   * @returns postdate
   * 
   * @memberOf HlsplayerComponent
   */
  getActualtimeSinceStart() {
    return this.timeService.getPostDate(this.startUTCTime, (this.getCurrentSeekTime() / 60));
  }


  /**
   * Sets start and end time and load thumbnail,recorded events and exporting events 
   * 
   * @param {*} [startTime=0]
   * @param {*} [endTime=0]
   * @param {*} [seekbar='normal']
   * 
   * @memberOf HlsplayerComponent
   */
  resetTimeAndReloadThumb(startTime: any = 0, endTime: any = 0, seekbar: any = 'normal') {
    let endUTCTime = null;
    if (endTime == 0) {
      endUTCTime = this.timeService.getCurrentUTCTime();
    } else {
      endUTCTime = endTime;
    }
    if (startTime == 0) {
      this.startUTCTime = this.timeService.getPredate(this.endUTCTime, this.playInterval);

    } else {
      this.startUTCTime = startTime;
    }
    this.endUTCTime = endUTCTime;
    if (seekbar == 'gotolive') {
      this.endUTCTime = this.timeService.getCurrentUTCTime();
      this.startUTCTime = this.startUTCTime = this.timeService.getPredate(this.endUTCTime, this.playInterval);
    }
    if (seekbar == 'custom') {
      this.reCalulateHoverPositionBasedOnPercentage();
      this.currentSeekTime = this.getActualtimeSinceStart();
      this.titleDate = this.timeService.getLocalTimeforPlayer(this.currentSeekTime, this.src.timezone);
    }
    else {
      this.titleDate = this.timeService.getLocalTimeforPlayer(this.endUTCTime, this.src.timezone)
    }
    this.endTime = this.timeService.getLocalTimeFrame(this.endUTCTime, this.src.timezone);
    this.startTime = this.timeService.getLocalTimeFrame(this.startUTCTime, this.src.timezone);

    this.loadThumbnails();
    this.loadRecordingEventList();
    this.loadExportingEventList();
    this.loadMotionStrips(seekbar);
    this.createPosterElement();
    this.markDates();
  }


  /**
   * Sets start and end time from calender and load thumbnail,recorded events and exporting events for player
   * 
   * @param {*} [startTime=0]
   * @param {*} [endTime=0]
   * @param {string} seek
   * 
   * @memberOf HlsplayerComponent
   */
  resetTimeAndReloadThumbForPlayer(startTime: any = 0, endTime: any = 0, seek: string) {

    this.LIVE = false;
    let endUTCTime = null;

    if (endTime == 0) {
      endUTCTime = this.timeService.getCurrentUTCTime();
    }
    else {
      endUTCTime = endTime;
    }
    if (startTime == 0) {
      this.startUTCTime = this.timeService.getPredate(this.endUTCTime, this.playInterval);
    }
    else {
      this.startUTCTime = startTime;// conveted UTC TIme 
    }
    this.endUTCTime = endUTCTime;
    let difference = null;
    this.duration = this.timeService.getTimeDifferenceInSeconds(this.startUTCTime, this.endUTCTime);
    this.endTime = this.timeService.getLocalTimeFrame(this.endUTCTime, this.src.timezone);
    this.titleDate = this.timeService.getLocalTimeforPlayer(this.endUTCTime, this.src.timezone)
    this.startTime = this.timeService.getLocalTimeFrame(this.startUTCTime, this.src.timezone);
    this.isPlaying = false;
    if (this.player.isPlaying()) {
      this.player.stop();
    }
    difference = this.timeService.getTimeDifferenceInSeconds(this.startUTCTime, this.endUTCTime);
    this.playInterval = this.duration / 60;
    let seektime = this.timeService.getPostDate(this.startUTCTime, difference / 120);
    this.currentSeekTime = seektime;
    this.moveSeekBarToGivenTime(seektime);
    this.currentSeekTime = seektime;
    this.titleDate = this.timeService.getLocalTimeforPlayer(seektime, this.src.timezone);
    this.loadThumbnails();
    this.loadRecordingEventList();
    this.loadExportingEventList();
    this.actionBarCommunicationService.process(this.getActualtimeSinceStart(), this.startUTCTime, this.endUTCTime, this.src.id);
    this.loadMotionStripsForSelectedRange(this.startUTCTime, this.endUTCTime);
    this.createPosterElement();
    this.markDates();
  }


  /**
  * To show spinner while loading vedio
  * 
  * 
  * @memberOf HlsplayerComponent
  */
  showSpinner() {
    this.el.querySelector('.spinner-three-bounce[data-spinner]').style.display = '';
  }

  /**
 * Used to hide spinner when vedio is loaded
 * 
 * 
 * @memberOf HlsplayerComponent
 */
  hideSpinner() {
    if (this.el.querySelector('.spinner-three-bounce[data-spinner]')) {
      this.el.querySelector('.spinner-three-bounce[data-spinner]').style.display = 'none';
    }
  }


  /**
  * Changes speed
  * 
  * 
  * @memberOf HlsplayerComponent
  */
  toggleSpeed() {
    if (this.isPlaying) {
      this.stop();
    }
    let rotate = [1, 2, 4, 8];
    let idx = rotate.indexOf(this.speed);
    if (idx >= rotate.length - 1) {
      this.speed = rotate[0];
    } else {
      this.speed = rotate[++idx];
    }
  }

  /**
  * To control mouse over event
  * 
  * @param {any} event
  * 
  * @memberOf HlsplayerComponent
  */
  controlMouseOver(event) {
    this.controlOpacity = "1";
    if (event) {
      event.preventDefault()
    }
  }


  /**
   * To control mouse out event
   * 
   * @param {any} event
   * 
   * @memberOf HlsplayerComponent
   */
  controlMouseOut(event) {

    if (this.controlOpacity == '1' && this.isFullScreen)
      this.controlOpacity = "0";
    if (event) {
      event.preventDefault()
    }
  }

  /**
  * Save starttime and endtime temporarily
  * 
  * 
  * @memberOf HlsplayerComponent
  */
  markDates() {
    this.videoService.markDates(this.startUTCTime, this.endUTCTime);
  }
  /**
    * 
    * 
    * 
    * @memberOf HlsplayerComponent
    */
  moveToPreviousTimeLine() {
    let endUTC = this.startUTCTime;
    let startUTC = this.timeService.getPredate(endUTC, this.playInterval);
    this.resetTimeAndReloadThumb(startUTC, endUTC, 'custom');
  }
  /**
    * 
    * 
    * 
    * @memberOf HlsplayerComponent
    */
  moveToNextTimeLine() {
    let startUTC;
    let endUTC;
    if (this.timeService.getTimediffinMinute(this.timeService.getCurrentUTCTime(), this.motions[this.motions.length - 1].endTime) < this.playInterval) {
      endUTC = this.timeService.getCurrentUTCTime();
      startUTC = this.timeService.getPredate(startUTC, this.playInterval);
    } else {
      startUTC = this.endUTCTime;
      endUTC = this.timeService.getPostDate(startUTC, this.playInterval);
    }
    this.resetTimeAndReloadThumb(startUTC, endUTC);
  }

  checkLocalConnectivity(imageUrl: string) {
    let image = document.createElement('img');
    image.src = imageUrl;
    let that = this;
    this.connectivityTimer = setTimeout(function (theImg) {
      return function () {
        that.playerService.setLocalConnectivityStatus(false);
       // console.log("IMG CHECK >> Timeout Reached");
      };
    } (image), 2000);

    image.onload = function () {
      that.playerService.setLocalConnectivityStatus(true);
     // console.log("IMG CHECK >> Timeout success");
      that.clearTimer();

    };

    image.onerror = function () {
      //   that.dialogService.alert(that.loginError);
     // console.log("IMG CHECK >> Timeout Error");
      that.playerService.setLocalConnectivityStatus(false);
    }
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  createStreamingSessionAndPlay() {

    var videoHeaders = new Headers();
    let that = this;
    this.showSpinner();
    this.reCalulateHoverPositionBasedOnPercentage();
    this.createPosterElement();
    let bodyVideo = {
      "type": "hls", "media_server_base_uri": this.playbackBase.baseUrl,
      "device_id": this.src.uid, "media_server_ipv4": this.playbackBase.gatewayIP
    }
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
        that.loaded = true;
        that.player.load(videoUrl);
        that.showPlayerControls = true;
      }).subscribe(() => {
        that.loading = false;
        that.hideSpinner();
        setTimeout(() => {
          if (!that.player.isPlaying()) {
            that.player.play();
            that.isPlaying = true;
          }
        }, 500);

        that.player.listenTo(this.player, Clappr.Events.PLAYER_PLAY, function () {
          that.isPlaying = that.player.isPlaying();
          that.playState = 0;
        })
      }, (e) => {
        that.showPlayerControls = true;
        that.isPlaying = false;
        that.hideSpinner();
        console.error("Error while playing..", e);
        that.dialogService.alert("Error while creating session.");
      }, () => {

      });
  }
}