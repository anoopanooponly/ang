/**********************************************************************************
* File Name   :   HlReelComponent.ts
* Description :   Highlight Reel Name Grouping 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { HighlightRealsData } from './../../../model/highlight-reals-data';
import { HlGroup } from './../../models/hl-group';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'hl-reel-list',
  templateUrl: './hl-reel-list.component.html',
  styleUrls: ['./hl-reel-list.component.css']
})
export class HlReelListComponent implements OnInit {
  private dataLoaded = false;
  private loadingSpinnerOn  =true;
  private routeSub: any;
  private reelList = [];

  /**
   * Creates an instance of HlReelListComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf HlReelListComponent
   */
  constructor(
    public highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.highlightsService.selectedItemCount = 0;
    let that = this;
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        if (this.highlightsService.PageName == HlGroup.REEL_NAME) {
          that.highlightsService.loadingSpinnerOn = false;
          that.highlightsService.reelsHavingCamera = [];
          // that.highlightsService.reelsHavingCamera.length = 0;
          that.LoadReels();
        }
      });
  }

  /**
   * 
   * 
   * 
   * @memberOf HlReelListComponent
   */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * 
   * 
   * 
   * @memberOf HlReelListComponent
   */
  ngOnInit() {
  }

  /**
   * Load reel data
   * call service, by passing reel id
   * 
   * @memberOf HlReelListComponent
   */
  LoadReels() {
    let that = this;
     that.loadingSpinnerOn = true;
    var source = that.highlightsService.getHighlightReelList()
      .flatMap((hlist) => {
         that.reelList = hlist;
        return hlist;
      })
      .concatMap((reel: any) => {
        return that.highlightsService.getHighlightReportPerReelName('default', reel.id, reel.name);
       }).map((reel: any) => {
        let reelObj = that.reelList.find(item => item.id == reel.reelId);
          reel.name = reelObj.reelName;
          reelObj.cameraList = reel.cameraList;
              reelObj.name = reel.reelName;
              reelObj.pageCount = reel.pageCount;
               if (reelObj.cameraList.length < 1) {
                  reelObj.noCameraFound = true;
              }else{
                 reelObj.noCameraFound = false;
              }
      that.highlightsService.reelsHavingCamera.push(reelObj);
      }).subscribe(data => {
          that.dataLoaded = true;
      }, ()=> {}, () => {
               that.loadingSpinnerOn = false;
      });
  }
}
