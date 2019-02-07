import { Router } from '@angular/router';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hl-download',
  templateUrl: './hl-download.component.html',
  styleUrls: ['./hl-download.component.css']
})
export class HlDownloadComponent implements OnInit {

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
  constructor(private highlightsService: HighlightsService,
  private router: Router
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
    this.highlightsService.selectedVideoUrls.forEach(videoUrl => {

      this.downloadURL(videoUrl, i);
      i++;
    });
    this.clearSelection();
  }

  clearSelection() {
    this.highlightsService.downloadBarActive = false;
    this.highlightsService.selectedCameras.forEach(element => {
      element.selected = false;
    });
    this.highlightsService.selectedItemCount = 0;
    this.highlightsService.selectedItemCountStr = '';
    this.highlightsService.selectedVideoUrls = [];
    this.highlightsService.selectedHlVideos = [];
    this.highlightsService.selectedCameras = [];
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
