
/**********************************************************************************
* File Name   :   LibStoreComponent.ts
* Description :   Library Store implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Constants } from './../../../model/constants';
import { Store } from './../../../model/store';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'lib-store',
  templateUrl: './lib-store.component.html',
  styleUrls: ['./lib-store.component.css']
})
export class LibStoreComponent implements OnInit {

  @Input() store: any;

  /**
   * Creates an instance of LibStoreComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf LibStoreComponent
   */
  constructor(public libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store = new Store();//Just initialize to avoid null exceptions when not used..
  }

  /**
   * 
   * 
   * 
   * @memberOf LibStoreComponent
   */
  ngOnInit() {
  }

  /**
   * on see more button click
   * 
   * 
   * @memberOf LibStoreComponent
   */
  onSeeMoreClick() {
    this.libraryService.seeMoreBackButtonOn = true;
    this.libraryService.seeMoreSelected = true;
    this.libraryService.selectedStoreId = this.store.id;
    this.libraryService.SeeMoreFromPageName = Constants.STORE_NAME;
    this.libraryService.PageName = Constants.SEE_MORE;
    this.libraryService.visibilityComboShow = false;
    this.router.navigate(['/library/seemore']);
  }

    /**
     * 
     * 
     * @param {any} camera 
     * 
     * @memberOf LibStoreComponent
     */
    onImageSelected(camera) {
    this.libraryService.onImageSelected(camera);
  }
}
