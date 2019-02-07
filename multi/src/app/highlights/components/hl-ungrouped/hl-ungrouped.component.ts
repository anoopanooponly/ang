/**********************************************************************************
* File Name   :   HlUngroupedComponent.ts
* Description :   Highlight Ungrouped items 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { HlGroup } from './../../models/hl-group';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { CookieService } from './../../../services/cookie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HighlightsService } from './../../../../../src/app/services/highlights.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'hl-ungrouped',
  templateUrl: './hl-ungrouped.component.html',
  styleUrls: ['./hl-ungrouped.component.css']
})
export class HlUngroupedComponent implements OnInit {

  cameras: any = [];
  currentPage = 0;
  private dataLoaded = false;
  private scrollSub;
  private routeSub: any;

  /**
   * Creates an instance of HlUngroupedComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {CookieService} cookieService 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * 
   * @memberOf HlUngroupedComponent
   */
  constructor(private highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private actionBarCommunicationService: ActionBarCommunicationService) {
    this.highlightsService.selectedItemCount = 0;
    let that = this;
    this.scrollSub = actionBarCommunicationService.scrollSource$.subscribe((message) => {
      that.onLoadMore();
      return;
    });

  }

  /**
   * unsubscribe the subscribed events
   * 
   * 
   * @memberOf HlUngroupedComponent
   */
  ngOnDestroy() {
    this.scrollSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  /**
   * call service to get ungrouped highlight data.
   * 
   * 
   * @memberOf HlUngroupedComponent
   */
  ngAfterViewInit() {

    let that = this;
    this.routeSub = this.route.data
      .subscribe((groupBy: any) => {
        that.highlightsService.getHighlightReportUngrouped('default', '0')
          .subscribe((libData: any) => {
            if (this.highlightsService.PageName == HlGroup.UNGROUPED) {
              that.cameras = libData.cameraList;
              that.dataLoaded = true;
              that.highlightsService.loadingSpinnerOn = false;
            }
          });
      }
      );
  }

  /**
   * 
   * 
   * 
   * @memberOf HlUngroupedComponent
   */
  ngOnInit() {
  }

  /**
   * load more data when scrolled down for more pages
   * 
   * 
   * @memberOf HlUngroupedComponent
   */
  onLoadMore() {
    this.dataLoaded = false;
    this.loadPage(++this.currentPage);
  }

  /**
   * load page by passing pageno
   * 
   * @param {any} pageNo 
   * 
   * @memberOf HlUngroupedComponent
   */
  loadPage(pageNo) {
    let that = this;
    this.highlightsService.getHighlightReportUngrouped('seemore', pageNo.toString())
      .subscribe((libData: any) => {
        that.cameras.push(...libData.cameraList);
        that.dataLoaded = true;
      });
  }

  /**
   * called when a thumbnail is selected.
   * 
   * @param {any} camera 
   * 
   * @memberOf HlUngroupedComponent
   */
  onImageSelected(camera) {
    this.highlightsService.onImageSelected(camera);
  }
}
