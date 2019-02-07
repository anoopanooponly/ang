
/**********************************************************************************
* File Name   :   GalleryComponent.ts
* Description :   This angular component renders the gallery representation in video tab. 
                  This also initialize a interval call which refresh images in a specific interval.   
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Injectable } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, ElementRef, ViewChildren ,trigger,transition,style,animate,state} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MdlSnackbarService } from 'angular2-mdl/components/snackbar/mdl-snackbar.service';
import 'rxjs/Rx';

import { Constants } from './../../../model/constants';
import { HeatmapService } from './../../../services/heatmap.service';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { VideoService } from './../../../services/video.service';
import { ActionService } from './../../../services/action.service';import { Camera } from './../../../model/camera';
import { GalleryService } from './../../../services/gallery.service';
import { ImageLoader } from './image.component';

@Component({
  selector: 'video-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [GalleryService],
 animations:[
    trigger('visibilityChanged', [
      state('false' , style({ opacity: 1, transform:  'translateY(0%)' })),
      state('true', style({ opacity: 1, transform:  'translateY(30%)'  })),
      transition('1 => 0', animate('.75s ease-in')),
      transition('0 => 1', animate('.75s'))
    ])
  ]  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class GalleryComponent {
  cameras: any = [];
  loaded = 0;
  defaultLoadedCnt = 0;
  interval: any;
  firstTimeload = true;
  private resize: any;
  private resizing: boolean = true;
  public hideHeatmapComparison: boolean;
  public heatmapCamera: Camera;
  private selectedItem;
  private router;
  private playerSelectedTime;
  private playerStartTime;
  private playerEndTime;
  private videoSub;
  private listObservSub;

  @ViewChildren(ImageLoader) imageChild: any;

  /**
   * Creates an instance of GalleryComponent.
   * @param {GalleryService} galleryService 
   * @param {VideoService} videoService 
   * @param {ActivatedRoute} route 
   * @param {ElementRef} element 
   * @param {MdlSnackbarService} mdlSnackbarService 
   * @param {Router} rout 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * @param {HeatmapService} heatmapService 
   * 
   * @memberOf GalleryComponent
   */
  constructor(galleryService: GalleryService,
 public actionService:ActionService,    public videoService: VideoService,
    private route: ActivatedRoute,
    element: ElementRef,
    private mdlSnackbarService: MdlSnackbarService,
    public rout: Router,
    private actionBarCommunicationService: ActionBarCommunicationService,
    public heatmapService: HeatmapService) {
    let that = this;
    this.loaded = 0;
    this.cameras = [];
    this.resizing = true;
    this.defaultLoadedCnt = 0;
    this.router = rout;
    this.playerSelectedTime = null;
    this.playerStartTime = null;
    this.playerEndTime =null;
    this.route.data
      .subscribe((dataStore: any) => {
        that.cameras = dataStore.gallery;
        if(that.videoService.getSelectedVideoSource() != null) {
          that.cameras.filter(store => store.id === that.videoService.getSelectedVideoSource().id).map(store => {
              store.expanded = true;
              })
        }
      });

    this.setNewInterval();

    
    this.hideHeatmapComparison = true;
    this.heatmapCamera = new Camera();
    this.videoSub = actionBarCommunicationService.videoTimeSource$.subscribe((msgObj: any) => {

      if ("closed" === msgObj.message) {
        this.stopBrowserNetworkCalls();
        this.reLoadCameras();
      } else {
        this.loadTimedCameras(msgObj.message,msgObj.startTime, msgObj.endTime, msgObj.id);
      }

    });

    //this.heatmapService.setDefaultDateRange();
  }


/**
 * 
 * 
 * 
 * @memberOf GalleryComponent
 */
stopBrowserNetworkCalls() {
        //cancel image downloads
  let win: any = window;
  if(win.stop !== undefined)
  {
      win.stop();
  }
  else if(document.execCommand !== undefined)
  {
      document.execCommand("Stop", false);
  }
}

  /**
   * 
   * 
   * @param {any} newTime 
   * @param {any} playerStartTime 
   * @param {any} playerEndTime 
   * @param {any} currentSrcId 
   * 
   * @memberOf GalleryComponent
   */
  loadTimedCameras(newTime, playerStartTime, playerEndTime, currentSrcId) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    let id = this.route.snapshot.params['id'];
    let type = this.route.snapshot.params['type'];
    //console.log("loadTimedCameras id::", id);
    //console.log("loadTimedCameras type::", type);
    let that = this;
    console.log("loadTimedCameras: ",newTime);
    this.playerSelectedTime = newTime;
    this.playerStartTime = playerStartTime;
    this.playerEndTime = playerEndTime;
    if(this.listObservSub != null) {
      this.listObservSub.unsubscribe();
    }
    let listObserv:any = type == 'store' ? this.videoService.getStoreCameras(id, newTime) : this.videoService.getViewCamaras(id, newTime);
    this.listObservSub = listObserv.subscribe((cams) => {
      that.cameras = cams;

      that.cameras.filter(cam => cam.id == currentSrcId).map(cam => {
         cam.expanded = true;
         }
         );

    });
  }

   /**
    * 
    * 
    * 
    * @memberOf GalleryComponent
    */
   reLoadCameras() {
   
    let id = this.route.snapshot.params['id'];
    let type = this.route.snapshot.params['type'];
    let that = this;
    this.playerSelectedTime = null; 
    this.playerStartTime = null;
    this.playerEndTime = null;
    if(this.listObservSub != null) {
      this.listObservSub.unsubscribe();
    }
    let listObserv: any = type == 'store' ? this.videoService.getStoreCameras(id) : this.videoService.getViewCamaras(id);
    this.listObservSub = listObserv.subscribe((cams) => {
      that.cameras = cams;
      that.setNewInterval();

    });
  }

  /**
   * 
   * 
   * 
   * @memberOf GalleryComponent
   */
  setNewInterval() {
    let that = this;
    this.interval = setInterval(function () {

      if (that.loaded >= that.cameras != null && that.cameras.length && that.resizing) {


        that.imageChild._results.some(
          elem => {
            if (elem.check()) {
              if (!that.checkImageActive(elem)) {
                return true;
              }
              //console.log("Time::" + new Date());
              elem.refresh();
              elem.src.description = elem.src.storeName + '(' + that.videoService.getCurrentTime(elem.src.timezone) + ')';
            }
            return false;
          });

      }
      that.resizing = true;
    }, 10000);
  }

  /**
   * 
   * 
   * @param {any} elem 
   * @returns 
   * 
   * @memberOf GalleryComponent
   */
  checkImageActive(elem) {
    let that = this;
    if (elem.getErrorCount() >= 3) {
      that.videoService.tryLoadingImage(elem.thumbnailUrl).subscribe(() => {
        that.setNewInterval();
      }, err => {

        //console.log("Errorrr>>>", err);
        that.mdlSnackbarService.showSnackbar({
          message: "An error occurred while refreshing the camera's thumbnail.",
          action: {
            handler: () => {
              that.imageChild._results.forEach(element => {
                element.clearErrorCount();
              });
              that.setNewInterval();
            },
            text: 'Retry'
          }
        });
      });
      clearInterval(that.interval);
      return false;
    }
    return true;
  }

  /**
   * 
   * 
   * 
   * @memberOf GalleryComponent
   */
  ngOnDestroy() {
    this.videoSub.unsubscribe();
    if(this.listObservSub != null) {
      this.listObservSub.unsubscribe();
    }
    
    this.cameras = [];
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.videoService.setSelectedVideoSource(null);
  }

  /**
   * 
   * 
   * 
   * @memberOf GalleryComponent
   */
  ngOnInit() {

    let that = this;
    this.loaded = 0;
    this.firstTimeload = true;

    this.resize = Observable
      .fromEvent(window, 'resize').debounceTime(100).subscribe((event) => {

        that.resizing = false;
      }, () => {
        //console.log("error");
      }, () => {
        //console.log("complete");
        that.resizing = false;
      });
  }

  /**
   * 
   * 
   * 
   * @memberOf GalleryComponent
   */
  ngAfterViewInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
     // document.getElementById('roterOutlet').scrollIntoView();
    });
  }

  /**
   * 
   * 
   * @param {any} inputChanges 
   * 
   * @memberOf GalleryComponent
   */
  ngOnChanges(inputChanges) {
      console.log("closed");

  }

  /**
   * 
   * 
   * @param {boolean} loaded 
   * 
   * @memberOf GalleryComponent
   */
  onLoaded(loaded: boolean) {
    if (loaded)
      this.loaded++;
  }

  /**
   * 
   * 
   * @param {boolean} defaultLoaded 
   * 
   * @memberOf GalleryComponent
   */
  onDefaultLoaded(defaultLoaded: boolean) {
    if (defaultLoaded)
      this.defaultLoadedCnt++;
  }

  /**
   * 
   * 
   * @param {any} event 
   * 
   * @memberOf GalleryComponent
   */
  onImageClicked(event) {
    if (this.heatmapService.heatmapOn) {
      if (event.thumbnailUrl != Constants.ERROR_IMAGE) {
        this.LoadHeatmapComparison(event);
      }
    }
    else {
      console.log("player");
      this.actionBarCommunicationService.action("true");
      this.LoadVideoPlayer(event);
    }

  }

  /**
   * 
   * 
   * @param {any} event 
   * 
   * @memberOf GalleryComponent
   */
  LoadHeatmapComparison(event) {

    let cameraId = event.uid;
    this.heatmapService.heatmapComparisonCameraId = cameraId;
    this.heatmapService.comparisonSelectedCameraName = event.storeName + ' : ' + event.name;
        let playerCtrl: any = document.getElementById("playerTop");
    playerCtrl.scrollIntoView(true);
    if (this.heatmapService.comparisonWindowOpen) {
      this.router.navigate(["./"], { relativeTo: this.route }).then(() => {
        this.router.navigate(["heatmap/" + cameraId], { relativeTo: this.route });
      });
    }
    else {
      //this.heatmapService.comparisonWindowOpen = true;
      this.router.navigate(['heatmap/' + cameraId], { relativeTo: this.route });
    }
  }

  /**
   * 
   * 
   * @param {any} event 
   * 
   * @memberOf GalleryComponent
   */
  public cancelClicked(event) {
    this.hideHeatmapComparison = true;
  }


  /**
   * 
   * 
   * @param {any} item 
   * @returns 
   * 
   * @memberOf GalleryComponent
   */
  LoadVideoPlayer(item) {
  
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    if(item.expanded) {
      return;
    }
    var otherExpandedArr = this.cameras.filter(each => each.id != item.id && each.expanded);
    item.expanded = !item.expanded;
    this.selectedItem = item;
   // this.actionBarCommunicationService.action("video");
    this.selectedItem.playerSeekBarTime = this.playerSelectedTime;
    console.log("gallaery component ----playerselectedtime",this.playerSelectedTime);
    this.selectedItem.startTime = this.playerStartTime;
    this.selectedItem.endTime = this.playerEndTime;
    // //if the newly selected item is already loaded.t
    // if(this.videoService.getSelectedVideoSource() != null && this.videoService.getSelectedVideoSource().id === this.selectedItem.id) {
    //    this.router.navigate(["player/" + this.selectedItem.id], { relativeTo: this.route });
    //   return;
    // }
    this.videoService.setSelectedVideoSource(this.selectedItem);
    let type = this.route.snapshot.params['type'];
    this.selectedItem = item;
    let that = this;

    if (otherExpandedArr != null && otherExpandedArr !== 'undefined' && otherExpandedArr.length > 0) {
      // this.stopBrowserNetworkCalls();
      this.router.navigate(["../"], { relativeTo: this.route }).then((val) => {
        otherExpandedArr[0].expanded = false;
        if(!val) {
               
          this.router.navigate(["./"], { relativeTo: this.route }).then((val) => {
            that.router.navigate(["player/" + that.selectedItem.id], { relativeTo: that.route });
          });

        } else {
         that.router.navigate(["player/" + that.selectedItem.id], { relativeTo: that.route });
        }
      });
    } else {
      that.router.navigate(["player/" + that.selectedItem.id], { relativeTo: that.route });
    }
  }

  /**
   * 
   * 
   * 
   * @memberOf GalleryComponent
   */
  onScrollDown() {
    console.log("on scrolled");
  }
}
