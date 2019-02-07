/**********************************************************************************
* File Name   :   ActionService.ts
* Description :   This class implements API client interface for Actions, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 25-Oct-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Http } from '@angular/http';
import { View } from './../model/view';
import { ApiBuilder } from './../utilities/api-builder';
import { Store } from './../model/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FilterDataHandler } from './../utilities/filter-data-handler';
import { CookieService } from './cookie.service';
import { LibraryService } from './library.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class ActionService {

  private TAG = "ACTION SERVICE :";
  private LIMITED_NAME_LENGTH = 18;
  private MAX_NAME_LENGTH = 20;
  private RET_SUCCESS = 200;
  private storesList = new Array<Store>();
  private viewsList = new Array<View>();
  private observable: Observable<any>;
  private observableOfView: Observable<any>;
  public pageTitle: string;
  private api;
  public PopupHidden: boolean;
  public isPlayer:boolean=false;
  /**
   * Creates an instance of ActionService.
   * @param {Http} http 
   * @param {LibraryService} libraryService 
   * @param {CookieService} cookieService 
   * 
   * @memberOf ActionService
   */
  constructor(private http: Http, private libraryService: LibraryService, private cookieService: CookieService) {
    this.api = ApiBuilder.getInstance();
    //get filter set by the use from cookie.
    let filters = this.cookieService.getCookie('filter');

    if (filters != null) {
      try {
        let filterList: Array<any> = JSON.parse(filters);
        if (filterList != null && filterList.length > 0)
          FilterDataHandler.getInstance().setFilterData(filterList);
        else
          FilterDataHandler.getInstance().clearFilter();
      } catch (e) {
        console.error(this.TAG + "restore filter from cookie failed.");
      }
    }

  }

  /**
  * Return Views list  
  * 
  * @return Array<View> : Array of Views
  */
  getViews() {
    let that = this;

    if (this.viewsList != null && this.viewsList.length > 0) {
      return Observable.of(this.viewsList);
    } else if (this.observableOfView) {
      return this.observableOfView;
    } else {
      this.observableOfView = this.http.get(this.api.getViewsURL(), {})
        .map(response => {
          let viewList = new Array<View>();
          let res = response.json();
          that.observableOfView = null;
          let rsponseStatus = response.status;
          if (rsponseStatus == this.RET_SUCCESS) {
            let views = res.data.views;
            if (views == null) {
              return null;
            }
            for (let i = 0; i < views.length; i++) {
              var view = new View();
              view.id = views[i].id;
              view.name = views[i].name;
              //short name to display 
              view.shortName = view.name;
              if (view.name.length > this.MAX_NAME_LENGTH) {
                view.shortName = view.name.substr(0, this.LIMITED_NAME_LENGTH) + '..';
              }
              viewList.push(view);
            }
            that.viewsList = viewList;
            return viewList;
          }
          else {
            return null;
          }
        })
        .share();
      return this.observableOfView;
    }
  }

  /**
  * Return Store list for 
  * 
  * @return Array<View> : Array of Views
  */

  getStores() {
    let that = this;

    if (this.storesList != null && this.storesList.length > 0) {
      // if `data` is available just return it as `Observable`
      return Observable.of(this.storesList);
    } else if (this.observable) {
      // if `this.observable` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.observable;
    } else {
      this.observable = this.http.get(this.api.getStoreURL(), {})
        .map(response => {
          that.observable = null;
          let storeList = [];
          let res = response.json();
          let reponseStatus = response.status;

          if (reponseStatus == this.RET_SUCCESS) {
            let sites = res.data.sites;

            if (sites == null) {
              return null;
            }

            for (let i = 0; i < sites.length; i++) {
              var store = new Store();
              store.id = sites[i].id;
              store.name = sites[i].name;
              store.shortName = store.name;
              
              if (store.name.length > this.MAX_NAME_LENGTH) {
                store.shortName = store.name.substr(0, this.LIMITED_NAME_LENGTH) + '..';
              }
              let gateway = sites[i].gateways;
              if (gateway != null) {
                if (gateway.length > 0) {
                  storeList.push(store);
                }
              }
            }
            that.storesList = storeList;
            that.libraryService.storeList = storeList;//For using in library
            return storeList;
          }

          else {
            return null;
          }
        })
        .share();
      return this.observable;
    }
  }
  /**
  * Clear sSore list and  Views list  
  * 
  * @return Array<View> : Array of Views
  */
  clearAll() {
    this.storesList = null;
    this.viewsList = null;
    this.observableOfView = null;
  }

}