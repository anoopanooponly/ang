
/**********************************************************************************
* File Name   :   LibStoreListComponent.ts
* Description :   Library Store implementation
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Visibility } from './../../../model/visibility';
import { Constants } from './../../../model/constants';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { ActionService } from './../../../services/action.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryService } from './../../../services/library.service';
import { Component, OnInit } from '@angular/core';
import { Store } from './../../../model/store';
import * as _ from 'lodash';
@Component({
  selector: 'lib-store-list',
  templateUrl: './lib-store-list.component.html',
  styleUrls: ['./lib-store-list.component.css']
})
export class LibStoreListComponent implements OnInit {

  private dataLoaded = false;
  private routeSub: any;
  public storeList: any = [];
  private loadingSpinnerOn = false;

  /**
   * Creates an instance of LibStoreListComponent.
   * @param {LibraryService} libraryService 
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {ActionService} actionService 
   * 
   * @memberOf LibStoreListComponent
   */
  constructor(
    public libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute,
    private actionService: ActionService
  ) {
    this.libraryService.selectedItemCount = 0;
    this.libraryService.loadingSpinnerOn = true;
    let that = this;
    this.routeSub = this.route.data
      .subscribe((libGroupBy: any) => {
        if (this.libraryService.PageName == Constants.STORE_NAME) {
          that.libraryService.storesHavingCamera = [];
          // that.libraryService.storesHavingCamera.length = 0;
          that.LoadStores();
        }
      });
  }

  /**
   * 
   * 
   * 
   * @memberOf LibStoreListComponent
   */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * 
   * 
   * 
   * @memberOf LibStoreListComponent
   */
  ngOnInit() {
  }

  /**
   * Load library data groupped by store
   * 
   * 
   * @memberOf LibStoreListComponent
   */
  LoadStores() {


    let that = this;
    that.loadingSpinnerOn = true;
    var source = that.actionService.getStores()
      .map((s) => {
        return s;
      })
      .do((stores: any) => {
        let index: number = 0;
        that.storeList = stores;
        for (let ind in that.storeList) {
          let str = new Store();
          str.id = stores[ind].id;
          str.noCameraFound = true;
          that.libraryService.storesHavingCamera.push(str);
        }
        for (let ss in stores) {
          that.libraryService.loadingSpinnerOn = false;
          that.libraryService.getLibraryDataPerStore(stores[index].id, this.libraryService.dataVisiblity)
            .subscribe((libData: any) => {
              let store = that.storeList.find(item => item.id == libData.storeId);
              store.noCameraFound = false;
              store.cameraList = libData.cameraList;
              store.itemCount = libData.itemCount;
              if (store.cameraList.length < 1) {
                //let s = that.libraryService.storesHavingCamera.find(item => item.id == libData.storeId);
                // if (s == null) {
                //   that.libraryService.storesHavingCamera.push(store);
                //  } 
                store.noCameraFound = true;
              } else {
                store.noCameraFound = false;
              }
              let indx = _.findIndex(that.libraryService.storesHavingCamera, function (o: any) { return o.id == libData.storeId });
              that.libraryService.storesHavingCamera[indx] = store;
            });
          index++;

        }
      }).subscribe((storeList) => {
        that.libraryService.loadingSpinnerOn = false;
        this.dataLoaded = true;

      });


  }
}
