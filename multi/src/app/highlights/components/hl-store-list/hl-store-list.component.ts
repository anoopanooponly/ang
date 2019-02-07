/**********************************************************************************
* File Name   :   HlStoreListComponent.ts
* Description :   Highlight Store Name Grouping 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Constants } from './../../../model/constants';
import { HlGroup } from './../../models/hl-group';
import { ActionService } from './../../../services/action.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HighlightsService } from './../../../services/highlights.service';
import { Component, OnInit } from '@angular/core';
import { Store } from './../../../model/store';
import * as _ from 'lodash';

@Component({
  selector: 'hl-store-list',
  templateUrl: './hl-store-list.component.html',
  styleUrls: ['./hl-store-list.component.css']
})
export class HlStoreListComponent implements OnInit {
  private dataLoaded = false;
  private routeSub: any;
  private source: any;
  public storeList: any = [];
  private loadingSpinnerOn = true;

  /**
   * Creates an instance of HlStoreListComponent.
   * @param {HighlightsService} highlightsService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {ActionService} actionService 
   * 
   * @memberOf HlStoreListComponent
   */
  constructor(
    public highlightsService: HighlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private actionService: ActionService
  ) {
    this.highlightsService.selectedItemCount = 0;
    let that = this;
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        if (this.highlightsService.PageName == HlGroup.STORE_NAME) {
          that.highlightsService.loadingSpinnerOn = false;
          that.highlightsService.storesHavingCamera = [];
          // that.highlightsService.storesHavingCamera.length = 0;
          that.LoadStores();
        }
      });
  }

  /**
   * 
   * unsubscribe subscribed events..
   * 
   * @memberOf HlStoreListComponent
   */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.source.unsubscribe();
  }

  /**
   * 
   * 
   * 
   * @memberOf HlStoreListComponent
   */
  ngOnInit() {
  }

  
/**
 * 
 * load highlight data grouped by store. 
 * 
 * @memberOf HlStoreListComponent
 */
LoadStores() {
    let that = this;
     that.loadingSpinnerOn = true;
     if( this.source != null) {
      this.source.unsubscribe();
     }
     this.source = that.actionService.getStores()
      .flatMap((stores) => {
         that.storeList = stores;
        return stores;
      })
      .concatMap((store: any) => {
        let index: number = 0;
          return that.highlightsService.getHighlightReportPerStore('default', store.id)
            

      }).map((store: any) => {
        let storeObj = that.storeList.find(item => item.id == store.storeId);
        storeObj.noCameraFound = false;
              storeObj.cameraList = store.cameraList;
              storeObj.pageCount = store.pageCount;
              if (storeObj.cameraList.length < 1) {
                  storeObj.noCameraFound = true;
              }else{
                 storeObj.noCameraFound = false;
              }
      that.highlightsService.storesHavingCamera.push(storeObj);
      }).subscribe(data => {
          that.dataLoaded = true;
      }, ()=> {}, () => {
               that.loadingSpinnerOn = false;
      });
  }
  
}
