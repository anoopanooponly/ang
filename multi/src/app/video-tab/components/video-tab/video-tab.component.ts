
/**********************************************************************************
* File Name   :   VideoTabComponent.ts
* Description :   This angular component represents the Video Tab and also act as the parent component for action component and view Component.
                  Action component represents the actionbar and view component represents the video tab gallery.  
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HeatmapService } from './../../../services/heatmap.service';

@Component({
  selector: 'app-video-tab',
  templateUrl: './video-tab.component.html',
  styleUrls: ['./video-tab.component.css'],

})
export class VideoTabComponent {

  videoType: string;

  /**
   * Creates an instance of VideoTabComponent.
   * @param {ActivatedRoute} route 
   * @param {HeatmapService} heatmapService 
   * 
   * @memberOf VideoTabComponent
   */
  constructor(public route: ActivatedRoute, private heatmapService: HeatmapService) {
    //this.videoType = this.route.snapshot.params['type'];
    this.route.params.subscribe(params => {
      this.videoType = '' + params['type'];
    });
  }

  /**
   * 
   * 
   * 
   * @memberOf VideoTabComponent
   */
  onClick() {
    this.heatmapService.calendarPopupOn = false;
  }

}
