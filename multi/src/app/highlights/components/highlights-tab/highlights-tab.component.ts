/**********************************************************************************
* File Name   :   HighlightsTabComponent.ts
* Description :   Highlight Action related functionalities are implemented in this class 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { HlGroup } from './../../models/hl-group';
import { HighlightsService } from './../../../services/highlights.service';
import { CookieService } from './../../../services/cookie.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-highlights-tab',
  templateUrl: './highlights-tab.component.html',
  styleUrls: ['./highlights-tab.component.css']
})
export class HighlightsTabComponent implements OnInit {

  /**
   * Creates an instance of HighlightsTabComponent.
   * @param {HighlightsService} highlightsService 
   * @param {CookieService} cookieService 
   * 
   * @memberOf HighlightsTabComponent
   */
  constructor(public highlightsService: HighlightsService,
    private cookieService: CookieService
  ) {
    let selectedGroup = this.cookieService.getCookieGroupBy();
    this.highlightsService.downloadBarActive = false;
  }

  /**
   * 
   * 
   * 
   * @memberOf HighlightsTabComponent
   */
  ngOnInit() {
  }

  /**
   * 
   * 
   * 
   * @memberOf HighlightsTabComponent
   */
  ngOnDestroy() {
  }
}
