
/**********************************************************************************
* File Name   :   ImageLoader.ts
* Description :   This angular component renders the image given in the source(input) object. Displays a spinner until image is loaded. 
                  Also notify the parent container once an image is loaded. It also performs the refresh of the image if it is 
                 in the visible area of the browser.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { ApiBuilder } from './../../../utilities/api-builder';
import { HeatmapService } from './../../../services/heatmap.service';
import { Camera } from './../../../model/camera';
import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'image-loader',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageLoader {
  loaded = false;
  errorCnt = 0;
  sample = true;
  @Input() src: any;
  @Input() srcAttr: any;
  private resize: any;
  private defaultLoaded = false;
  @Output() onLoaded = new EventEmitter<boolean>();
  @Output() onDefaultLoaded = new EventEmitter<boolean>();
  // @Output() onToggle = new EventEmitter();
  @Output() onImageClicked: EventEmitter<Camera> = new EventEmitter();
  private apiBuilder;

  /**
   * Creates an instance of ImageLoader.
   * @param {ElementRef} _el 
   * @param {HeatmapService} heatmapService 
   * 
   * @memberOf ImageLoader
   */
  constructor(private _el: ElementRef,
  private heatmapService:HeatmapService) {
    this.apiBuilder = ApiBuilder.getInstance();
    this.defaultLoaded = false;
  
  }

  /**
   * 
   * 
   * 
   * @memberOf ImageLoader
   */
  public onload(): void {
    this.loaded = true;

    if (this.src != null && this.src[this.srcAttr] != null && this.src[this.srcAttr].indexOf("thumbnail-error") <= 0) {
      this.errorCnt = 0;
    }
    this.onLoaded.emit(this.loaded);
  }

  /**
   * 
   * 
   * 
   * @memberOf ImageLoader
   */
  public onDefautload(): void {
    this.defaultLoaded = true;
    this.onDefaultLoaded.emit(this.defaultLoaded);
  }

  /**
   * 
   * 
   * 
   * @memberOf ImageLoader
   */
  public onError(): void {
    this.loaded = true;
    this.errorCnt++;
    this.src[this.srcAttr] = "assets/img/thumbnail-error-small.png";
    this.onLoaded.emit(this.loaded);
  }

  /**
   * 
   * 
   * 
   * @memberOf ImageLoader
   */
  ngOnInit() {
    if(this.srcAttr.indexOf('heatmapCam') != -1) {
      this.src.isOnline = true;
    } 
  }

  refresh() {
    if (this.loaded && !this.heatmapService.heatmapOn) {
     // if (this.heatmapService.heatmapOn) {
     //   this.src.thumbnailUrlOld = this.src.thumbnailUrl; 
     //    this.src.thumbnailUrl = this.src.heatmapUrl + "&refresh=" + Date.now();
    //  }
    //  else {
        this.src.thumbnailUrl = this.src.thumbnailUrlOld + "&refresh=" + Date.now();
   //   }
    }
  }
  
  /**
   * 
   * 
   * 
   * @memberOf ImageLoader
   */
  onImgClick() {
   this.onImageClicked.emit(this.src);
  //this.onToggle.emit(this.src);
}

  /**
   * 
   * 
   * @param {any} val 
   * 
   * @memberOf ImageLoader
   */
  setDefaultLoaded(val) {
    this.defaultLoaded = val;
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf ImageLoader
   */
  getErrorCount() {
    
    return this.errorCnt;
  }

  /**
   * 
   * 
   * 
   * @memberOf ImageLoader
   */
  clearErrorCount() {
    this.errorCnt = 0;
  }

  /**
   * 
   * 
   * @param {boolean} [partial=true] 
   * @param {string} [direction='vertical'] 
   * @returns 
   * 
   * @memberOf ImageLoader
   */
  check(partial: boolean = true, direction: string = 'vertical') {

    const el = this._el.nativeElement;
    let elm1 = el.querySelector("img");
    const elSize = (elm1.offsetWidth * elm1.offsetHeight);

    const rec = elm1.getBoundingClientRect();

    const vp = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const tViz = rec.top >= 0 && rec.top < vp.height;
    const bViz = (rec.bottom - 12) > 0 && rec.bottom <= vp.height;

    const lViz = rec.left >= 0 && rec.left < vp.width;
    const rViz = rec.right > 0 && rec.right <= vp.width;

    const vVisible = partial ? tViz || bViz : tViz && bViz;
    const hVisible = partial ? lViz || rViz : lViz && rViz;

    let event = {
      target: elm1,
      value: false
    };

    if (direction === 'both') {
      return (elSize && vVisible && hVisible) ? true : false;
    }
    else if (direction === 'vertical') {
      return (elSize && vVisible) ? true : false;
    }
    else if (direction === 'horizontal') {
      return (elSize && hVisible) ? true : false;
    }
  }
}