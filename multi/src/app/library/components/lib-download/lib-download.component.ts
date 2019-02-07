
/**********************************************************************************
* File Name   :   LibDownloadComponent.ts
* Description :   Library Download Clip Functionalities
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { VideoData } from './../../../model/video-data';
import { Response, Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { FilterDataHandler } from './../../../utilities/filter-data-handler';
import { Visibility } from './../../../model/visibility';
import { Constants } from './../../../model/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from './../../../services/cookie.service';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-download',
  templateUrl: './lib-download.component.html',
  styleUrls: ['./lib-download.component.css']
})
export class LibDownloadComponent implements OnInit {

  private hasAllRadioSelected: boolean;
  private hasPrivateRadioSelected: boolean;
  private hasSharedRadioSelected: boolean;
  public selectedGroup: string;
  public selectedVisibility: string;
  public groupingItems;
  private rightPos = 0;

  /**
   * Creates an instance of LibDownloadComponent.
   * @param {LibraryService} libraryService 
   * @param {CookieService} cookieService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {Http} http 
   * 
   * @memberOf LibDownloadComponent
   */
  constructor(private libraryService: LibraryService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http
  ) {

  }

  /**
   * 
   * 
   * 
   * @memberOf LibActionComponent
   */
  ngOnInit() {
  }

  onCancelClick() {
    this.clearSelection();
  }

  onDownloadClick() {
    let i = 0;
    this.libraryService.selectedVideoUrls.forEach(videoUrl => {

      this.downloadURL(videoUrl, i);
      i++;
    });
    this.clearSelection();
  }

  clearSelection() {
    this.libraryService.downloadBarActive = false;
    this.libraryService.selectedCameras.forEach(element => {
      element.selected = false;
    });
    this.libraryService.selectedItemCount = 0;
    this.libraryService.selectedItemCountStr = '';
    this.libraryService.selectedVideoUrls = [];
    this.libraryService.selectedLibVideos = [];
    this.libraryService.selectedCameras = [];
  }

  /**
   * find the url for downloading video
   * 
   * @param {any} url 
   * @param {any} count 
   * 
   * @memberOf LibActionComponent
   */
  downloadURL(url, count) {
    var hiddenIFrameID = 'hiddenDownloader' + count++;
    var iframe = document.createElement('iframe');
    iframe.id = hiddenIFrameID;
    iframe.name = hiddenIFrameID;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.src = url;
  }


}
