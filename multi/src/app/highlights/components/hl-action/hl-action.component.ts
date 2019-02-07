/**********************************************************************************
* File Name   :   HlActionComponent.ts
* Description :   Highlight Action related functionalities are implemented in this class 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { FilterDataHandler } from './../../../utilities/filter-data-handler';
import { Router, ActivatedRoute } from '@angular/router';
import { HlGroup } from './../../models/hl-group';
import { CookieService } from './../../../services/cookie.service';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hl-action',
  templateUrl: './hl-action.component.html',
  styleUrls: ['./hl-action.component.css']
})
export class HlActionComponent implements OnInit {

  public selectedGroup: string;
  private rightPos = 0;

  /**
   * Creates an instance of HlActionComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {CookieService} cookieService 
   * 
   * @memberOf HlActionComponent
   */
  constructor(private highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.selectedGroup = this.cookieService.getCookieHLGroupBy();

    if (this.selectedGroup == null) {
      this.selectedGroup = HlGroup.UNGROUPED;
    }
    this.loadByGroup(this.selectedGroup);
  }

  /**
   * 
   * 
   * 
   * @memberOf HlActionComponent
   */
  ngOnInit() {
    this.rightPos = this.getScrollBarWidth();
  }

  /**
   * Group By value has been selected from combo box
   * 
   * @param {any} selectedGroup 
   * 
   * @memberOf HlActionComponent
   */
  public onChangeGrouping(selectedGroup) {
    this.loadByGroup(selectedGroup);
  }

  /**
   * Load highlight details based on the selected group.
   * 
   * @param {any} selectedGroup 
   * @returns 
   * 
   * @memberOf HlActionComponent
   */
  public loadByGroup(selectedGroup) {
    //this.libraryService.seeMoreSelected = false;
    if(selectedGroup === this.highlightsService.GroupBy) {
      return;
    }
    this.highlightsService.GroupBy = selectedGroup;
    this.highlightsService.PageName = selectedGroup;
    //this.highlightsService.groupBySelected = true;
    this.cookieService.setCookieHLGroupBy(this.highlightsService.GroupBy);
    this.highlightsService.loadingSpinnerOn = false;
    this.highlightsService.storesHavingCamera = [];
    this.highlightsService.seeMoreBackButtonOn = false;

    switch (selectedGroup) {
      case HlGroup.UNGROUPED:
        this.router.navigate(['/highlights/ungrouped']);
        break;
      case HlGroup.STORE_NAME:
        this.router.navigate(['/highlights/store']);
        break;
      case HlGroup.REEL_NAME:
        this.router.navigate(['/highlights/reelName']);
        break;
      case HlGroup.TIME_OF_CLIP:
        this.router.navigate(['/highlights/TimeOfClip']);
        break;
    }
  }

  /**
   * back button click from see more page
   * 
   * 
   * @memberOf HlActionComponent
   */
  onBackClick() {
    this.highlightsService.seeMoreBackButtonOn = false;
    this.highlightsService.PageName = this.highlightsService.SeeMoreFromPageName;
    this.router.navigate(['/highlights/' + this.highlightsService.PageName]);
    //this.router.navigate(['../'], { relativeTo: this.route });    
  }

  /**
   * 
   * download the selected video
   * 
   * @memberOf HlActionComponent
   */
  onDownloadClick() {
    let i = 0;
    this.highlightsService.selectedVideoUrls.forEach(videoUrl => {
      this.downloadURL(videoUrl, i);
      i++;
    });
  }


/**
 * send the selected video.
 * 
 * 
 * @memberOf HlActionComponent
 */
sendMail() {

    if(this.highlightsService.selectedHlVideos.length > 0) {
      let body = "You have been sent the following mutliSight Video(s)%0A%0A%0A%0A";
      let i = 1;
    this.highlightsService.selectedHlVideos.forEach(video => {
      body += i +  ") " + (video.displayName)  + (",") + (video.displayDescription);
      body+= "%0A URL:" + window.location.protocol + "/" + window.location.hostname  + "/" + video.videoURL + "%0A%0A";
      i++;
        });
        let subject = "MultiSight Video Clip";
        let mailCC = "";
          
         document.location.href = "mailto:"+ ''+'&subject='+subject+'&body='+body;
    }
    
  }


  /**
   * Find download url for the selected video
   * 
   * @param {any} url 
   * @param {any} count 
   * 
   * @memberOf HlActionComponent
   */
  downloadURL(url, count) {
    var hiddenIFrameID = 'hiddenDownloader' + count++;
    var iframe = document.createElement('iframe');
    iframe.id = hiddenIFrameID;
    iframe.name = hiddenIFrameID;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.src = url;
  }

  /**
   * Find scroll bar width
   * 
   * @returns 
   * 
   * @memberOf HlActionComponent
   */
  getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
  };

  /**
   * reload the data
   * 
   * 
   * @memberOf HlActionComponent
   */
  reload() {
    let queryOptional = null;
    let inst = FilterDataHandler.getInstance();
    if (inst.filterQuery != null &&
      inst.filterQuery != 'undefined') {
      queryOptional = inst.filterQuery != '' ? inst.filterQuery : 'false';
    }
    this.router.navigate(['./', { filter: (queryOptional != null ? queryOptional : "") }], { relativeTo: this.route });
    this.highlightsService.storesHavingCamera = [];
  }

}
