
/**********************************************************************************
* File Name   :   LibUngroupedComponent.ts
* Description :   Library Ungrouped implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Visibility } from './../../../model/visibility';
import { pauseIcon } from 'icons/02-pause.svg';
import { Constants } from './../../../model/constants';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { CookieService } from './../../../services/cookie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lib-ungrouped',
  templateUrl: './lib-ungrouped.component.html',
  styleUrls: ['./lib-ungrouped.component.css']
})
export class LibUngroupedComponent implements OnInit {

  cameras: any = [];
  currentPage = 0;
  private dataLoaded = false;
  private scrollSub;
  private routeSub: any;

  /**
   * Creates an instance of LibUngroupedComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {CookieService} cookieService 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * 
   * @memberOf LibUngroupedComponent
   */
  constructor(private libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private actionBarCommunicationService: ActionBarCommunicationService) {
    this.libraryService.selectedItemCount = 0;
    let that = this;

    this.scrollSub = actionBarCommunicationService.scrollSource$.subscribe((message) => {
      that.onLoadMore();
      return;
    });

    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        // that.libraryService.libDataMapForCreatedDate = [];
        // that.libraryService.libDataMapForClipDate = [];
        this.libraryService.currentPageNo = 0;
        that.libraryService.getLibraryDataUngrouped('0', that.libraryService.dataVisiblity)
          .subscribe((libData) => {
            that.cameras = libData.cameraList;
            that.dataLoaded = true;
            that.libraryService.loadingSpinnerOn = false;
          });
      });
  }

  /**
   * 
   * unsubscribe the subscribed events.
   * 
   * @memberOf LibUngroupedComponent
   */
  ngOnDestroy() {
    this.scrollSub.unsubscribe();
  }

  /**
   * 
   * 
   * 
   * @memberOf LibUngroupedComponent
   */
  ngOnInit() {
  }

  /**
   * 
   * called when scrolled down for more pages.
   * 
   * @memberOf LibUngroupedComponent
   */
  onLoadMore() {
    this.dataLoaded = false;
    this.loadPage(++this.currentPage);
  }

  /**
   * load library data page by passing pageno.
   * 
   * @param {any} pageNo 
   * 
   * @memberOf LibUngroupedComponent
   */
  loadPage(pageNo) {
    let that = this;
    this.libraryService.getLibraryDataUngrouped(pageNo.toString(), this.libraryService.dataVisiblity)
      .subscribe((libData: any) => {
        that.cameras.push(...libData.cameraList);
        that.dataLoaded = true;
      });
  }

  /**
   * called when image is selected.
   * 
   * @param {any} camera 
   * 
   * @memberOf LibUngroupedComponent
   */
  onImageSelected(camera) {
    this.libraryService.onImageSelected(camera);
  }
}
