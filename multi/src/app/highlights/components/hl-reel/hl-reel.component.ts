
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

import { Router, ActivatedRoute } from '@angular/router';
import { HlGroup } from './../../models/hl-group';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'hl-reel',
  templateUrl: './hl-reel.component.html',
  styleUrls: ['./hl-reel.component.css']
})
export class HlReelComponent implements OnInit {

  @Input() store: any;

  /**
   * Creates an instance of HlReelComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf HlReelComponent
   */
  constructor(
    public highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * 
   * 
   * 
   * @memberOf HlReelComponent
   */
  ngOnInit() {
  }

  /**
   * 
   * display the rest of the data
   * 
   * @memberOf HlReelComponent
   */
  onSeeMoreClick() {
    this.highlightsService.seeMoreBackButtonOn = true;
    // this.highlightsService.seeMoreSelected = true; 
    this.highlightsService.selectedReelId = this.store.id;
    this.highlightsService.selectedReelName = this.store.name;
    this.highlightsService.SeeMoreFromPageName = HlGroup.REEL_NAME;
    this.highlightsService.PageName = HlGroup.SEE_MORE;
    this.highlightsService.GroupBy = HlGroup.REEL_NAME;
    this.router.navigate(['/highlights/seemore']);
  }


  /**
   * 
   * 
   * @param {any} camera 
   * 
   * @memberOf HlReelComponent
   */
  onImageSelected(camera) {
    this.highlightsService.onImageSelected(camera);
  }
}
