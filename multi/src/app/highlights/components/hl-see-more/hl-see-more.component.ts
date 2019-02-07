/**********************************************************************************
* File Name   :   HlSeeMoreComponent.ts
* Description :   Impementation of see more functionalities. This UI displayes more data on clicking see more buttons 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { LibCamera } from './../../../model/lib-camera';
import { Camera } from './../../../model/camera';
import { HighlightDataList } from './../../../model/highlight-data-list';
import { HlGroup } from './../../models/hl-group';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { CookieService } from './../../../services/cookie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'hl-see-more',
  templateUrl: './hl-see-more.component.html',
  styleUrls: ['./hl-see-more.component.css']
})
export class HlSeeMoreComponent implements OnInit {

  public cameras = new Array<LibCamera>();
  currentPage = 0;
  private dataLoaded = false;
  private scrollSub;
  private routeSub: any;
  public title: string;

  /**
   * Creates an instance of HlSeeMoreComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {CookieService} cookieService 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * 
   * @memberOf HlSeeMoreComponent
   */
  constructor(private highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private actionBarCommunicationService: ActionBarCommunicationService) {
    this.highlightsService.selectedItemCount = 0;
    let that = this;
    // this.routeSub = this.route.data
    //   .subscribe((libGroupBy: any) => {
    //     that.highlightsService.loadingSpinnerOn = false;
    //     that.loadCamera();
    //   });
    that.loadCamera();
    this.scrollSub = actionBarCommunicationService.scrollSource$.subscribe((message) => {
      that.onLoadMore();
      return;
    });

  }

  /**
   * unsubscribe the subscribed events on page destroy
   * 
   * 
   * @memberOf HlSeeMoreComponent
   */
  ngOnDestroy() {
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * load the detailed data for the particular item(reel/store)
   * 
   * 
   * @memberOf HlSeeMoreComponent
   */
  loadCamera() {
    let that = this;
    switch (this.highlightsService.GroupBy) {
      case HlGroup.STORE_NAME:
        this.highlightsService.getHighlightReportPerStore('seemore', this.highlightsService.selectedStoreId, '0')
          .subscribe((libData: any) => {
            that.cameras = libData.cameraList;
            that.dataLoaded = true;
            that.highlightsService.loadingSpinnerOn = false;
            if (that.cameras.length > 0) {
              that.title = that.cameras[0].siteName;

            }
          });
        break;
      case HlGroup.REEL_NAME:
        this.highlightsService.getHighlightReportPerReelName('seemore', that.highlightsService.selectedReelId, that.highlightsService.selectedReelName, '0')
          .subscribe((libData: any) => {
            that.cameras = libData.cameraList;
            that.dataLoaded = true;
            that.highlightsService.loadingSpinnerOn = false;
            if (that.cameras.length > 0) {
              that.title = that.highlightsService.selectedReelName;
            }
          });
        break;
      case HlGroup.TIME_OF_CLIP:
        // this.highlightsService.getHighlightReportByDate('0')
        //   .subscribe((libData: any) => {
        //     that.cameras = libData.cameraList;
        //     that.dataLoaded = true;
        //     that.highlightsService.loadingSpinnerOn = false;
        //   });
        this.title = this.highlightsService.dateSelected;
        this.highlightsService.getClipDateLibData();
        this.cameras = this.highlightsService.datewiseSeeMoreList;
        break;
    }

  }

  /**
   * 
   * 
   * 
   * @memberOf HlSeeMoreComponent
   */
  ngOnInit() {

  }

  /**
   * called while being scrolled down for more pages.
   * 
   * 
   * @memberOf HlSeeMoreComponent
   */
  onLoadMore() {
    this.dataLoaded = false;
    this.loadPage(++this.currentPage);
  }

  /**
   * load a particular page, by passing pageno
   * 
   * @param {any} pageNo 
   * 
   * @memberOf HlSeeMoreComponent
   */
  loadPage(pageNo) {
    let that = this;

    switch (this.highlightsService.GroupBy) {
      case HlGroup.STORE_NAME:
        this.highlightsService.getHighlightReportPerStore('seemore', this.highlightsService.selectedStoreId, pageNo.toString())
          .subscribe((libData: any) => {
            that.dataLoaded = true;
            // that.highlightsService.loadingSpinnerOn = false;
            that.cameras.push(...libData.cameraList);
            that.highlightsService.loadingSpinnerOn = false;
          });
        break;
      case HlGroup.REEL_NAME:
        this.highlightsService.getHighlightReportPerReelName('seemore', that.highlightsService.selectedReelId, that.highlightsService.selectedReelName, pageNo.toString())
          .subscribe((libData: any) => {
            that.dataLoaded = true;
            // that.highlightsService.loadingSpinnerOn = false;
            that.cameras.push(...libData.cameraList);
            that.highlightsService.loadingSpinnerOn = false;
          });
        break;
      case HlGroup.TIME_OF_CLIP:
        this.highlightsService.getClipDateLibData();
        this.highlightsService.loadingSpinnerOn = false;
        this.cameras = this.highlightsService.datewiseSeeMoreList;
        break;
    }
  }

  /**
   * 
   * 
   * @param {any} camera 
   * 
   * @memberOf HlSeeMoreComponent
   */
  onImageSelected(camera) {
    this.highlightsService.onImageSelected(camera);
  }
}
