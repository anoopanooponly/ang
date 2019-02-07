/**********************************************************************************
* File Name   :   PeopleActionComponent.ts
* Description :   This angular component renders the people count tab actionbar which hold stores selection
                  filter, download, email etc.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { FilterDataHandler } from './../../../utilities/filter-data-handler';
import { Store } from './../../../model/store';
import { CookieService } from './../../../services/cookie.service';
import { GalleryService } from './../../../services/gallery.service';
import { VideoService } from './../../../services/video.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionService } from './../../../services/action.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-action',
  templateUrl: './people-action.component.html',
  styleUrls: ['./people-action.component.css']
})
export class PeopleActionComponent implements OnInit {

  private rightPos = 0;
  private stores: Array<Store> = [];
  private selectedStore = "all";
 
  /**
   * Creates an instance of PeopleActionComponent.
   * 
   * @param {Router} router
   * @param {ActionService} actionService
   * @param {ActivatedRoute} route
   * @param {CookieService} cookieService
   * @param {ActionBarCommunicationService} actionBarComm
   * 
   * @memberOf PeopleActionComponent
   */
  constructor(public router: Router,
    private actionService: ActionService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private actionBarComm : ActionBarCommunicationService) {

    this.intializeStoreAndView();
    let that =this;
    this.route.params.subscribe(params => {
      that.selectedStore = '' + params['storeid'];
    });
 }

  
  /**
   * 
   * 
   * 
   * @memberOf PeopleActionComponent
   */
  ngOnInit() {
    this.rightPos = this.getScrollBarWidth();
  }

  
  /**
   * Finds the width of scrollbar
   * 
   * @returns width
   * 
   * @memberOf PeopleActionComponent
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
   *To set the initial store and view value 
   * 
   * 
   * 
   * @memberOf PeopleActionComponent
   */
    intializeStoreAndView() {
    let that = this;
    this.route.data
      .subscribe((dataStore: any) => {
        that.stores = [];
        that.stores.push({ id: "all",
        name: "All store",
        shortName: "All store"});
        that.stores.push(...dataStore.data);

        if(that.selectedStore != 'all') {
          let storesFoundList = that.stores.filter(store => store.id == that.selectedStore);
          if(storesFoundList == null || storesFoundList.length == 0) {
            that.selectedStore = "all";
          }
        }
      });
  }

 
  /**
   * Navigates to the selected store url when a store is selected
   * 
   * @param {string} selectedStore
   * 
   * @memberOf PeopleActionComponent
   */
    onPeopleStoreChange(selectedStore: string) {
      this.router.navigate(['/peoplecount/' + selectedStore]);
    }


 
  /**
   * 
   * 
   * 
   * @memberOf PeopleActionComponent
   */
    reload() {
      let queryOptional = null;
      let inst = FilterDataHandler.getInstance();
      if (inst.filterQuery != null &&
        inst.filterQuery != 'undefined') {
        queryOptional = inst.filterQuery != '' ? inst.filterQuery : 'false';
      }
      this.router.navigate(['./', { filter: (queryOptional != null ? queryOptional : "") }], { relativeTo: this.route });
    }


  /**
   * Downloads report
   * 
   * 
   * @memberOf PeopleActionComponent
   */
  onDownloadClick() {
    this.actionBarComm.download();
  }
}
