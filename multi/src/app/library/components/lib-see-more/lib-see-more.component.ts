
/**********************************************************************************
* File Name   :   LibPlayerResolver.ts
* Description :   Library Route Resolver
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/


import { CalendarData } from './../../../model/calendar-data';
import { Constants } from './../../../model/constants';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { CookieService } from './../../../services/cookie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lib-see-more',
  templateUrl: './lib-see-more.component.html',
  styleUrls: ['./lib-see-more.component.css']
})
export class LibSeeMoreComponent implements OnInit {

  cameras: any = [];
  currentPage = 0;
  public title: string;
  private dataLoaded = false;
  private scrollSub;
  private routeSub: any;

  /**
   * Creates an instance of LibSeeMoreComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {CookieService} cookieService 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * 
   * @memberOf LibSeeMoreComponent
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

  }

  /**
   * unsubscribe subscribed events
   * 
   * 
   * @memberOf LibSeeMoreComponent
   */
  ngOnDestroy() {
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * load camera on init of page
   * 
   * 
   * @memberOf LibSeeMoreComponent
   */
  ngAfterViewInit() {
    let that = this;
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        that.libraryService.loadingSpinnerOn = false;
        that.loadCamera();
      });
  }

  /**
   * load camera details by calling service
   * 
   * 
   * @memberOf LibSeeMoreComponent
   */
  loadCamera() {
    let that = this;
    this.libraryService.getLibraryDataPerStore(this.libraryService.selectedStoreId, this.libraryService.dataVisiblity, '0')
      .subscribe((libData: any) => {
        that.libraryService.libDatacontainer = libData;
        that.cameras = libData.cameraList;
        that.dataLoaded = true;
        that.libraryService.loadingSpinnerOn = false;
        if (that.cameras.length > 0) {
          that.title = that.cameras[0].siteName;
        }
      });
  }

  /**
   * 
   * 
   * 
   * @memberOf LibSeeMoreComponent
   */
  ngOnInit() {
  }

  /**
   * called when scrolled down.
   * 
   * 
   * @memberOf LibSeeMoreComponent
   */
  onLoadMore() {
    this.dataLoaded = false;
    this.loadPage(++this.currentPage);
  }

  /**
   * load page by passing pageno
   * 
   * @param {any} pageNo 
   * 
   * @memberOf LibSeeMoreComponent
   */
  loadPage(pageNo) {
    let that = this;
    this.libraryService.getLibraryDataPerStore(this.libraryService.selectedStoreId, pageNo.toString())
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
     * @memberOf LibSeeMoreComponent
     */
    onImageSelected(camera) {
    this.libraryService.onImageSelected(camera);
  }
}
