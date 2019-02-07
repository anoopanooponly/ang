
/**********************************************************************************
* File Name   :   LibraryTabComponent.ts
* Description :   Library Tab implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Visibility } from './../../../model/visibility';
import { Constants } from './../../../model/constants';
import { LibraryService } from './../../../services/library.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'library-tab',
  templateUrl: './library-tab.component.html',
  styleUrls: ['./library-tab.component.css'],
  providers: []

})
export class LibraryTabComponent implements OnInit {

  public pageName: string;

  /**
   * Creates an instance of LibraryTabComponent.
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {LibraryService} libraryservice 
   * 
   * @memberOf LibraryTabComponent
   */
  constructor(private router: Router,
    private route: ActivatedRoute,
    private libraryservice: LibraryService) {
    this.libraryservice.loadingSpinnerOn = true;
    this.libraryservice.downloadBarActive = false;
    // libraryservice.dataVisiblity = Visibility.LIB_SHOWALL;
    // libraryservice.dataVisiblityDisplay = Visibility.DISPLAY_SHOWALL;
  }

  /**
   * 
   * 
   * 
   * @memberOf LibraryTabComponent
   */
  ngOnInit() {
  }
}
