
/**********************************************************************************
* File Name   :   LibSeemoreDatewiseComponent.ts
* Description :   Library See More implementation for TimeofClip and TimeCreated
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Constants } from './../../../model/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lib-seemore-datewise',
  templateUrl: './lib-seemore-datewise.component.html',
  styleUrls: ['./lib-seemore-datewise.component.css']
})
export class LibSeemoreDatewiseComponent implements OnInit {

  private dataLoaded = false;
  private scrollSub;
  private routeSub: any;
  public title: string;

  /**
   * Creates an instance of LibSeemoreDatewiseComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf LibSeemoreDatewiseComponent
   */
  constructor(
    private libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.libraryService.selectedItemCount = 0;
    let that = this;
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        that.libraryService.loadingSpinnerOn = false;
        that.dataLoaded = true;
        that.loadCamera();
      });
  }

  /**
   * 
   * 
   * 
   * @memberOf LibSeemoreDatewiseComponent
   */
  ngOnInit() {
  }

  /**
   * unsubscribe subscribed events.
   * 
   * 
   * @memberOf LibSeemoreDatewiseComponent
   */
  ngOnDestroy() {
    if (this.scrollSub != null) {
      this.scrollSub.unsubscribe();
    }
    if (this.routeSub != null) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * load library data group by clip date and created date. 
   * 
   * 
   * @memberOf LibSeemoreDatewiseComponent
   */
  loadCamera() {
    if (this.libraryService.PageName == Constants.SEE_MORE_CLIP_DATE) {
      this.title = this.libraryService.selectedClipDate;
      this.libraryService.getClipDateLibData(this.libraryService.selectedClipDate);

    }
    else if (this.libraryService.PageName == Constants.SEE_MORE_CREATED_DATE) {
      this.title = this.libraryService.selectedClipDate;
      this.libraryService.getCreatedDateLibData(this.libraryService.selectedClipDate);
    }
  }

  /**
   * called when image is selected.
   * 
   * @param {any} camera 
   * 
   * @memberOf LibSeemoreDatewiseComponent
   */
  onImageSelected(camera) {
    this.libraryService.onImageSelected(camera);
  }
}
