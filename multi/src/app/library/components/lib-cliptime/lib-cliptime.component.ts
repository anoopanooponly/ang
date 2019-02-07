
/**********************************************************************************
* File Name   :   LibCliptimeComponent.ts
* Description :   Library Clip Time Implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from './../../../model/constants';
import { LibraryService } from './../../../services/library.service';
import { LibdataDatewise } from './../../../model/libdata-datewise';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lib-cliptime',
  templateUrl: './lib-cliptime.component.html',
  styleUrls: ['./lib-cliptime.component.css']
})
export class LibCliptimeComponent implements OnInit {

  @Input() clipData: LibdataDatewise;

  /**
   * Creates an instance of LibCliptimeComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * 
   * @memberOf LibCliptimeComponent
   */
  constructor(private libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  /**
   * 
   * 
   * 
   * @memberOf LibCliptimeComponent
   */
  ngOnInit() {
  }

  /**
   * called when seemore button is clicked for more pages.
   * 
   * 
   * @memberOf LibCliptimeComponent
   */
  onSeeMoreClick() {
    this.libraryService.seeMoreBackButtonOn = true;
    this.libraryService.seeMoreSelected = true;
    this.libraryService.SeeMoreFromPageName = this.libraryService.PageName;
    if (this.libraryService.PageName == Constants.TIME_OF_CLIP) {
      this.libraryService.selectedClipDate = this.clipData.clipDate;
      this.libraryService.PageName = Constants.SEE_MORE_CLIP_DATE;
    }
    else if (this.libraryService.PageName == Constants.TIME_CREATED) {
      this.libraryService.selectedClipDate = this.clipData.createdDate;
      this.libraryService.PageName = Constants.SEE_MORE_CREATED_DATE;
    }
    this.libraryService.visibilityComboShow = false;
    this.router.navigate(['/library/seemore']);
  }

  /**
   * called when image is selected.
   * 
   * @param {any} camera 
   * 
   * @memberOf LibCliptimeComponent
   */
  onImageSelected(camera) {
    this.libraryService.onImageSelected(camera);
  }
}
