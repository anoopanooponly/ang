
/**********************************************************************************
* File Name   :   LibImageComponent.ts
* Description :   Library Image Component Implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Camera } from './../../../model/camera';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryService } from './../../../services/library.service';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
  selector: 'lib-image',
  templateUrl: './lib-image.component.html',
  styleUrls: ['./lib-image.component.css']
})
export class LibImageComponent implements OnInit {

  loaded = false;
  errorCnt = 0;
  sample = true;
  @Input() src: any;
  private resize: any;
  private defaultLoaded = false;
  private player;
  private showPlayer;
  private timerSub: any;
  @Output() onImageClicked: EventEmitter<Camera> = new EventEmitter();

  /**
   * Creates an instance of LibImageComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {ElementRef} _el 
   * 
   * @memberOf LibImageComponent
   */
  constructor(private libraryService: LibraryService,
    private highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private _el: ElementRef
  ) {
    // this.defaultLoaded = false;
    this.showPlayer = false;

    let timer = Observable.timer(2000, 8000);
    this.timerSub = timer.subscribe(t => {
      this.refresh(t);
    });
  }

  /**
   * image is refreshed.
   * 
   * @param {any} time 
   * 
   * @memberOf LibImageComponent
   */
  public refresh(time) {
    if (this.src.percentComplete < 100) {
      this.libraryService.getClipCompletionPercentage(this.src.exportId).subscribe(percentage => {
        this.src.percentComplete = percentage;
      });
    }
  }

  /**
   * on load.
   * 
   * 
   * @memberOf LibImageComponent
   */
  public onload(): void {
    this.loaded = true;

    if (this.src != null && this.src.thumbnailUrl != null && this.src.thumbnailUrl.indexOf("thumbnail-error") <= 0) {
      this.errorCnt = 0;
    }
    // this.onLoaded.emit(this.loaded);
  }

  /**
   * load default data.
   * 
   * 
   * @memberOf LibImageComponent
   */
  public onDefautload(): void {
    this.defaultLoaded = true;
    // this.onDefaultLoaded.emit(this.defaultLoaded);
  }

  /**
   * 
   * 
   * 
   * @memberOf LibImageComponent
   */
  public onError(): void {
    this.loaded = true;
    this.errorCnt++;
    //this.src.thumbnailUrl = "assets/img/thumbnail-error-small.png";
    // this.onLoaded.emit(this.loaded);
  }

  /**
   * 
   * 
   * 
   * @memberOf LibImageComponent
   */
  ngOnInit() {
    this.showPlayer = false;
    this.resize = Observable
      .fromEvent(window, 'resize').debounceTime(100).subscribe((event) => {
      });

  }

  /**
   * 
   * unsubscribe subscribed events.
   * 
   * @memberOf LibImageComponent
   */
  ngOnDestroy() {
    this.timerSub.unsubscribe();
  }

  /**
   * called when the thumbnail image is clicked
   * 
   * 
   * @memberOf LibImageComponent
   */
  onDownloadSelected() {
    if (this.src.status != 'error' && this.src.percentComplete == 100) {
      this.src.selected = true;
      this.onImageClicked.emit(this.src);
    }
  }

  onDownloadUnSelected() {
    this.src.selected = false;   
    this.onImageClicked.emit(this.src);
  }

  /**
   * 
   * 
   * @param {any} val 
   * 
   * @memberOf LibImageComponent
   */
  setDefaultLoaded(val) {
    this.defaultLoaded = val;
  }

  /**
   * get the error count
   * 
   * @returns 
   * 
   * @memberOf LibImageComponent
   */
  getErrorCount() {

    return this.errorCnt;
  }

  /**
   * clea error count
   * 
   * 
   * @memberOf LibImageComponent
   */
  clearErrorCount() {
    this.errorCnt = 0;
  }

  /**
   * 
   * on double click, video player is played..
   * 
   * @memberOf LibImageComponent
   */
  onImgDblClick() {
    this.libraryService.selectedVideoUrl = this.src.videoURL;
    this.libraryService.selectedThumbNailUrl = this.src.thumbnailUrl;
    this.libraryService.selectedCameraName = this.src.cameraName;
    this.libraryService.selectedClipDate = this.src.startTime;
    this.libraryService.selectedClipCreatedDate = this.src.createdTime;
    let that = this;
    if (this.libraryService.playerOpen) {
      this.router.navigate(["../"], { relativeTo: this.route }).then(() => {
        that.router.navigate(["player/" + this.src.exportId], { relativeTo: that.route });
      });

    }
    else {
      this.libraryService.playerOpen = true;
      this.router.navigate(["player/" + this.src.exportId], { relativeTo: this.route });
    }
  }

  /**
   * called when dialog box becomes visible
   * 
   * 
   * @memberOf LibImageComponent
   */
  onDialogShow() {
    // this.playVideo();
    this.showPlayer = true;
  }

  /**
   * 
   * 
   * 
   * @memberOf LibImageComponent
   */
  seek1() {
    this.player.load('http://clappr.io/highline.mp4');
    this.player.play();
  }

  /**
   * 
   * 
   * 
   * @memberOf LibImageComponent
   */
  seek2() {
    this.player.load(this.src.videoURL);
    this.player.play();
  }

  /**
   * play the video with clapper control
   * 
   * 
   * @memberOf LibImageComponent
   */
  playVideo() {
    var playerElement = document.getElementById('video-player');
    this.player = new Clappr.Player({
      baseUrl: '/vendor/clappr',
      poster: this.src.thumbnailUrl,
      source: this.src.videoURL,
      mute: true,
      height: 360,
      width: 640,
      autoPlay: true
    });
    this.player.attachTo(playerElement);
    //player.play();
  }

  /**
   * 
   * 
   * 
   * @memberOf LibImageComponent
   */
  onDialogHide() {
    //this.player.destroy();
    this.showPlayer = false;
  }

}
