
/**********************************************************************************
* File Name   :   HlCliptimeComponent.ts
* Description :   Highlight Clipt Time Grouping 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { HlGroup } from './../../models/hl-group';
import { HighlightsService } from './../../../../../src/app/services/highlights.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HighlightDataList } from './../../../model/highlight-data-list';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'hl-cliptime',
  templateUrl: './hl-cliptime.component.html',
  styleUrls: ['./hl-cliptime.component.css']
})
export class HlCliptimeComponent implements OnInit {

  @Input() clipData;

  /**
   * Creates an instance of HlCliptimeComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf HlCliptimeComponent
   */
  constructor(private highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  /**
   * 
   * 
   * 
   * @memberOf HlCliptimeComponent
   */
  ngOnInit() {
  }

  /**
   * page with more details of the selected 'clip date' on clicking see more link
   * 
   * @param {any} dateSelected 
   * 
   * @memberOf HlCliptimeComponent
   */
  onSeeMoreClick(dateSelected) {
    this.highlightsService.dateSelected = dateSelected;
    this.highlightsService.seeMoreBackButtonOn = true;
    this.highlightsService.seeMoreSelected = true;
    this.highlightsService.SeeMoreFromPageName = HlGroup.TIME_OF_CLIP;
    this.highlightsService.PageName = HlGroup.SEE_MORE;
    this.router.navigate(['/highlights/seemore']);
  }

  /**
   * This event is fired on selecting the image.
   * 
   * @param {any} camera 
   * 
   * @memberOf HlCliptimeComponent
   */
  onImageSelected(camera) {
    this.highlightsService.onImageSelected(camera);
  }
}
