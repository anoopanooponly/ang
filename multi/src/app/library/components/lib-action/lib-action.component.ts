
/**********************************************************************************
* File Name   :   LibActionComponent.ts
* Description :   Library Clip Time Implementation
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
//var FileSaver = require('file-saver');

@Component({
  selector: 'lib-action',
  templateUrl: './lib-action.component.html',
  styleUrls: ['./lib-action.component.css']
})
export class LibActionComponent implements OnInit {

  private hasAllRadioSelected: boolean;
  private hasPrivateRadioSelected: boolean;
  private hasSharedRadioSelected: boolean;
  public selectedGroup: string;
  public selectedVisibility: string;
  public groupingItems;
  private rightPos = 0;
  public mode:string;

  /**
   * Creates an instance of LibActionComponent.
   * @param {LibraryService} libraryService 
   * @param {CookieService} cookieService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {Http} http 
   * 
   * @memberOf LibActionComponent
   */
  constructor(private libraryService: LibraryService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http
  ) {
    this.mode='0';
    this.hasAllRadioSelected = true;
    this.hasPrivateRadioSelected = false;
    this.hasSharedRadioSelected = false;
    this.selectedGroup = this.cookieService.getCookieGroupBy();
    if (this.libraryService.dataVisiblityDisplay == null) {
      this.libraryService.dataVisiblityDisplay = Visibility.DISPLAY_SHOWALL;
    }
    let visi = this.cookieService.getCookieLibVisibility();
    if (visi == null) {
      visi = Visibility.DISPLAY_SHOWALL;
    }
    this.selectedVisibility = visi
    this.libraryService.dataVisiblityDisplay = visi;
    switch (visi) {
      case Visibility.DISPLAY_SHOWALL:
        this.mode='0';
        this.hasAllRadioSelected = true;
        this.hasPrivateRadioSelected = false;
        this.hasSharedRadioSelected = false;
        break;
      case Visibility.DISPLAY_LIB_ONLYME: 
        this.mode='1';
        this.hasPrivateRadioSelected = true;
        this.hasAllRadioSelected = false;
        this.hasSharedRadioSelected = false;
        break;
      case Visibility.DISPLAY_LIB_SHARED: 
       this.mode='2';
        this.hasSharedRadioSelected = true;
        this.hasAllRadioSelected = false;
        this.hasPrivateRadioSelected = false;
        break;
    }

    if (this.selectedGroup == null) {
      this.selectedGroup = Constants.UNGROUPED;
      this.loadByGroup(this.selectedGroup);
    }
  }

  /**
   * 
   * 
   * 
   * @memberOf LibActionComponent
   */
  ngOnInit() {
    this.rightPos = this.getScrollBarWidth();
  }

  public onChangeGrouping(selectedGroup) {
    this.loadByGroup(selectedGroup);
  }

  /**
   * called when the group by is changed from drop down list
   * 
   * @param {any} selectedGroup 
   * 
   * @memberOf LibActionComponent
   */
  public loadByGroup(selectedGroup) {
    this.libraryService.seeMoreSelected = false;
    this.libraryService.LibraryGroupBy = selectedGroup;
    this.libraryService.PageName = selectedGroup;
    this.libraryService.groupBySelected = true;
    this.cookieService.setCookieGroupBy(this.libraryService.LibraryGroupBy);
    this.libraryService.loadingSpinnerOn = false;
    // this.libraryService.storesHavingCamera = [];
    this.libraryService.seeMoreBackButtonOn = false;
    switch (selectedGroup) {
      case Constants.UNGROUPED:
        this.router.navigate(['/library/ungrouped']);
        // this.router.navigateByUrl('/library(groupbyRoute:ungrouped)');
        break;
      case Constants.STORE_NAME:
        this.router.navigate(['/library/store']);
        break;
      case Constants.TIME_CREATED:
        this.router.navigate(['/library/timeCreated']);
        break;
      case Constants.TIME_OF_CLIP:
        this.router.navigate(['/library/timeOfClip']);
        break;
    }
  }

  /**
   * called when the visibility value is changed from dropdown list.
   * 
   * @param {any} visibility 
   * 
   * @memberOf LibActionComponent
   */
  public onChangeVisibility(visibility) {
    this.cookieService.setCookieLibVisibility(visibility);
    this.libraryService.setVisibilityOption(visibility);
    this.router.navigate(['./', { visibility: this.libraryService.dataVisiblityDisplay }], { relativeTo: this.route });

  }

  /**
   * called when seemore back button is clicked.
   * 
   * 
   * @memberOf LibActionComponent
   */
  onBackClick() {
    this.libraryService.visibilityComboShow = true;
    this.libraryService.seeMoreBackButtonOn = false;
    this.libraryService.PageName = this.libraryService.SeeMoreFromPageName;
    this.router.navigate(['/library/' + this.libraryService.PageName]);
    //this.router.navigate(['../'], { relativeTo: this.route });    
  }

  /**
   * 
   * download selected video.
   * 
   * @memberOf LibActionComponent
   */
  onDownloadClick() {
    let i = 0;
    this.libraryService.selectedVideoUrls.forEach(videoUrl => {

      this.downloadURL(videoUrl, i);
      i++;
    });
  }


  /**
   * send selected video as mail.
   * 
   * 
   * @memberOf LibActionComponent
   */
  sendMail() {

    if (this.libraryService.selectedLibVideos.length > 0) {
      let body = "You have been sent the following mutliSight Video(s)%0A%0A%0A%0A";
      let i = 1;
      let win: any = window;

      this.libraryService.selectedLibVideos.forEach(video => {
        body += i + ") " + (video.displayName) + (",") + (video.displayDescription);
        body += "%0A URL:" + window.location.protocol + "/" + window.location.hostname + "/" + video.videoURL + "%0A%0A";
        i++;
      });
      let subject = "MultiSight Video Clip";
      let mailCC = "";

      document.location.href = "mailto:" + '' + '&subject=' + subject + '&body=' + body;
    }

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


  /**
   * This method is not used.
   * 
   * @param {any} sUrl 
   * @returns 
   * 
   * @memberOf LibActionComponent
   */
  download1(sUrl) {
    let win: any = window;
    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
      //alert('Your device does not support files downloading. Please try again in desktop browser.');
      window.open(sUrl, '_blank');
      return false;
    }
    win.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    win.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    //If in Chrome or Safari - download via virtual link click
    if (win.downloadFile.isChrome || win.downloadFile.isSafari) {
      //Creating new link node.
      var link = document.createElement('a');
      link.href = sUrl;
      link.setAttribute('target', '_blank');

      if (link.download !== undefined) {
        //Set HTML5 download attribute. This will prevent file from opening if supported.
        var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
        link.download = fileName;
      }

      //Dispatching click event.
      if (document.createEvent) {
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return true;
      }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
      sUrl += '?download';
    }

    window.open(sUrl, '_blank');
    return true;
  }

  /**
   * download the selected file.
   * 
   * @param {string} videoUrl 
   * @returns {*} 
   * 
   * @memberOf LibActionComponent
   */
  downloadFile(videoUrl: string): any {

    var reader = new FileReader();
    let headers = new Headers({ 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename=test.mp4', 'MyApp-Application': 'AppName', 'Accept': 'video/mp4' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.ArrayBuffer });

    return this.http.get(videoUrl, options)

      .subscribe(this.extractContent);
  }

  /**
   * 
   * 
   * @private
   * @param {Response} res 
   * 
   * @memberOf LibActionComponent
   */
  private extractContent(res: Response) {
    let blob: Blob = res.blob();
    // FileSaver.saveAs(blob, 'video.mp4');
  }

  /**
   * download selected video
   * 
   * @param {any} videoUrl 
   * 
   * @memberOf LibActionComponent
   */
  public download(videoUrl) {

    // Xhr creates new context so we need to create reference to this
    let self = this;

    // Status flag used in the template.


    // Create the Xhr request object
    let xhr = new XMLHttpRequest();
    let url = videoUrl;
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    // Xhr callback when we get a result back
    // We are not using arrow function because we need the 'this' context
    xhr.onreadystatechange = function () {

      // We use setTimeout to trigger change detection in Zones
      setTimeout(() => { }, 0);

      // If we get an HTTP status OK (200), save the file using fileSaver
      if (xhr.readyState === 4 && xhr.status === 200) {
        var blob = new Blob([this.response], { type: 'video/mp4' });
        // FileSaver.saveAs(blob, 'video1.mp4');
      }
    };

    // Start the Ajax request
    xhr.send();
  }

  /**
   * get width of scroll bar.
   * 
   * @returns 
   * 
   * @memberOf LibActionComponent
   */
  getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
  };

  /**
   * reload the data
   * 
   * 
   * @memberOf LibActionComponent
   */
  reload() {
    let queryOptional = null;
    let inst = FilterDataHandler.getInstance();
    if (inst.filterQuery != null &&
      inst.filterQuery != 'undefined') {
      queryOptional = inst.filterQuery != '' ? inst.filterQuery : 'false';
    }
    this.router.navigate(['./', { filter: (queryOptional != null ? queryOptional : "") }], { relativeTo: this.route });
    this.libraryService.storesHavingCamera = [];
  }

  public onAllRadioChange() {
   this.mode='0';
    this.libraryService.seeMoreBackButtonOn = false;
    this.hasAllRadioSelected = true;
    this.hasPrivateRadioSelected = false;
    this.hasSharedRadioSelected = false;
    this.cookieService.setCookieLibVisibility(Visibility.DISPLAY_SHOWALL);
    this.libraryService.setVisibilityOption(Visibility.DISPLAY_SHOWALL);
    this.router.navigate(['./', { visibility: this.libraryService.dataVisiblityDisplay }], { relativeTo: this.route });
  }
  public onPrivateRadioChange() {
    this.mode='1';
    this.libraryService.seeMoreBackButtonOn = false;
    this.hasAllRadioSelected = false;
    this.hasPrivateRadioSelected = true;
    this.hasSharedRadioSelected = false;
    this.cookieService.setCookieLibVisibility(Visibility.DISPLAY_LIB_ONLYME);
    this.libraryService.setVisibilityOption(Visibility.DISPLAY_LIB_ONLYME);
    this.router.navigate(['./', { visibility: this.libraryService.dataVisiblityDisplay }], { relativeTo: this.route });
  }
  public onSharedRadioChange() {
   this.mode='2';
    this.libraryService.seeMoreBackButtonOn = false;
    this.hasAllRadioSelected = false;
    this.hasPrivateRadioSelected = false;
    this.hasSharedRadioSelected = true;
    this.cookieService.setCookieLibVisibility(Visibility.DISPLAY_LIB_SHARED);
    this.libraryService.setVisibilityOption(Visibility.DISPLAY_LIB_SHARED);
    this.router.navigate(['./', { visibility: this.libraryService.dataVisiblityDisplay }], { relativeTo: this.route });
  }
}
