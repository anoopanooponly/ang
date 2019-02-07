
/**********************************************************************************
* File Name   :   LibCliptimeListComponent.ts
* Description :   Library Clip Time Implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Visibility } from './../../../model/visibility';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { Constants } from './../../../model/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-cliptime-list',
  templateUrl: './lib-cliptime-list.component.html',
  styleUrls: ['./lib-cliptime-list.component.css']
})
export class LibCliptimeListComponent implements OnInit {

  private dataLoaded = false;
  private routeSub: any;
  private scrollSub: any;
  public dateList: any = [];
  private waitingForResponse = false;

  /**
   * Creates an instance of LibCliptimeListComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {ActionBarCommunicationService} actionBarCommunicationService 
   * 
   * @memberOf LibCliptimeListComponent
   */
  constructor(
  
    public libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute,
    private actionBarCommunicationService: ActionBarCommunicationService
    
  ) {
    this.dataLoaded = false;
    this.libraryService.selectedItemCount = 0;
    this.libraryService.loadingSpinnerOn = true;
    let that = this;
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {

        if (this.libraryService.PageName == Constants.TIME_OF_CLIP) {
          that.libraryService.libDataMapForCreatedDate = [];
          that.libraryService.libDataMapForClipDate = [];
          this.libraryService.currentPageNo = 0;
          that.LoadClipDates();
        }
        else if (this.libraryService.PageName == Constants.TIME_CREATED) {
          that.libraryService.libDataMapForCreatedDate = [];
          that.libraryService.libDataMapForClipDate = [];
          this.libraryService.currentPageNo = 0;
          that.LoadCreatedDates();
          
        }
      });

    this.scrollSub = actionBarCommunicationService.scrollSource$.subscribe((message) => {
      if (this.libraryService.PageName == Constants.TIME_OF_CLIP) {
        that.onLoadMoreClipDates();
      }
      else if (this.libraryService.PageName == Constants.TIME_CREATED) {
        that.onLoadMoreCreatedDates();
      }
      return;
    });
  }

  /**
   * unsubscribe the subscribed events.
   * 
   * 
   * @memberOf LibCliptimeListComponent
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
   * 
   * 
   * 
   * @memberOf LibCliptimeListComponent
   */
  ngOnInit() {
  }

  /**
   * load data group by clipdates
   * 
   * 
   * @memberOf LibCliptimeListComponent
   */
  LoadClipDates() {
    if (this.libraryService.currentPageNo < this.libraryService.totalClipDatePageCount) {
      this.libraryService.getClipDates(this.libraryService.dataVisiblity);
    }
  }

  /**
   * called when scrolled down for more pages
   * 
   * 
   * @memberOf LibCliptimeListComponent
   */
  onLoadMoreClipDates() {
    this.dataLoaded = false;
    this.libraryService.loadingSpinnerOn = true;
    this.libraryService.currentPageNo++;
    this.LoadClipDates();
  }

  /**
   * load created dates
   * 
   * 
   * @memberOf LibCliptimeListComponent
   */
  LoadCreatedDates() {
    this.libraryService.getCreatedDates(this.libraryService.dataVisiblity);
  }

  /**
   * called when scrolled down for more pages.
   * 
   * 
   * @memberOf LibCliptimeListComponent
   */
  onLoadMoreCreatedDates() {
    this.dataLoaded = false;
    this.libraryService.loadingSpinnerOn = true;
    this.libraryService.currentPageNo++;
    this.LoadCreatedDates();
  }

}
