
/**********************************************************************************
* File Name   :   HlCliptimeListComponent.ts
* Description :   Highlight Clip Time Grouping 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { HlGroup } from './../../../../../src/app/highlights/models/hl-group';
import { HighlightsService } from './../../../services/highlights.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeatmapService } from './../../../services/heatmap.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hl-cliptime-list',
  templateUrl: './hl-cliptime-list.component.html',
  styleUrls: ['./hl-cliptime-list.component.css']
})
export class HlCliptimeListComponent implements OnInit {

  private callNextPage: boolean = false;
  private dataLoaded = false;
  private currentPage = 0;
  private routeSub: any;
  private scrollSub: any;
  public dateList;
  private waitigForServerResponse = false;

  /**
   * Creates an instance of HlCliptimeListComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * 
   * @memberOf HlCliptimeListComponent
   */
  constructor(
    public highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private actionBarCommunicationService: ActionBarCommunicationService
  ) {
    this.highlightsService.selectedItemCount = 0;
    this.callNextPage = false;
    let that = this;
   /* this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        that.highlightsService.highlightDateWiseList = [];
        console.log("highlightDateWiseList cleared on route change");
      });*/

    this.scrollSub = this.actionBarCommunicationService.scrollSource$.subscribe((message) => {
      that.onLoadMoreClipDates();
      return;
    });

  }

  /**
   * 
   * unsubscribe the values when the page is destroyed.
   * 
   * @memberOf HlCliptimeListComponent
   */
  ngOnDestroy() {
    if (this.scrollSub != null) {
      this.scrollSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * load clip dates on init
   * 
   * 
   * @memberOf HlCliptimeListComponent
   */
  ngOnInit() {
    this.LoadClipDates(0);
  }

  /**
   * load clip dates
   * 
   * @param {number} pageNo 
   * 
   * @memberOf HlCliptimeListComponent
   */
  LoadClipDates(pageNo: number) {
    this.getClipDates(pageNo);
  }

  /**
   * this method is called when scrolling for more page
   * 
   * 
   * @memberOf HlCliptimeListComponent
   */
  onLoadMoreClipDates() {
    if (this.currentPage <= this.highlightsService.totalPageCount) {
      this.dataLoaded = false;
      this.LoadClipDates(++this.currentPage);
    }
    else 
    {
      this.dataLoaded = true;
    }
  }

  /**
   * get clip dates 
   * 
   * @param {number} pageNo 
   * @returns 
   * 
   * @memberOf HlCliptimeListComponent
   */
  getClipDates(pageNo: number) {
    if (this.waitigForServerResponse == true) {
      this.currentPage--;
      return;
    }
    let that = this;
    this.waitigForServerResponse = true;
    this.highlightsService.getHighlightReportByDate(pageNo.toString()).subscribe((clipDates) => {
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

      this.dateList = that.highlightsService.highlightDateWiseList;
      this.waitigForServerResponse = false;
      if (that.callNextPage) {
        this.currentPage++;
        that.getClipDates(this.currentPage);
      }

    });
  }

  /**
   * 
   * 
   * 
   * @memberOf HlCliptimeListComponent
   */
  ngOnChanges() {
    if (this.dateList == null || this.dateList == 'undefined' || this.dateList.length <= 0) {
      this.getClipDates(0);
    }
  }
}
