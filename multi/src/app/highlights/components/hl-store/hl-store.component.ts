/**********************************************************************************
* File Name   :   HlStoreComponent.ts
* Description :   Highlight Store Name Grouping 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Store } from './../../../model/store';
import { Constants } from './../../../model/constants';
import { LibraryService } from './../../services/library.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HighlightsService } from './../../../services/highlights.service';
import * as _ from 'lodash';

@Component({
  selector: 'hl-store',
  templateUrl: './hl-store.component.html',
  styleUrls: ['./hl-store.component.css']
})
export class HlStoreComponent implements OnInit {

  @Input() store: any;

  /**
   * Creates an instance of HlStoreComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf HlStoreComponent
   */
  constructor(public highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store = new Store();//Just initialize to avoid null exceptions when not used..
  }

  /**
   * 
   * 
   * 
   * @memberOf HlStoreComponent
   */
  ngOnInit() {
  }

  /**
   * load more details when seemore button is clicked..
   * 
   * 
   * @memberOf HlStoreComponent
   */
  onSeeMoreClick() {
    this.highlightsService.seeMoreBackButtonOn = true;
    // this.highlightsService.seeMoreSelected = true; 
    this.highlightsService.selectedStoreId = this.store.id;
    this.highlightsService.SeeMoreFromPageName = Constants.STORE_NAME;
    this.highlightsService.PageName = Constants.SEE_MORE;
    this.router.navigate(['/highlights/seemore']);
  }

  /**
   * called when image is selected
   * 
   * @param {any} camera 
   * 
   * @memberOf HlStoreComponent
   */
  onImageSelected(camera) {
    this.highlightsService.onImageSelected(camera);
  }
}
