/**********************************************************************************
* File Name   :   FilterComponent.ts
* Description :   This angular component represents all the filter functionality.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { StorageService } from './../../services/storage.sevice';
import { CookieService } from './../../services/cookie.service';
import { MdlDialogService } from 'angular2-mdl/components/dialog/mdl-dialog.service';
import { ActionService } from './../../services/action.service';
import { ActionBarCommunicationService } from './../../services/actionbar.communication.service';
import { FilterDataHandler } from './../../utilities/filter-data-handler';
import { FilterData } from './../../model/filter-data';
import { FilterService } from './../../services/filter.service';
import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  private fromoffsetTop;
  private showFilter;
  private filterLoaded = false;
  private filters: Array<FilterData>;
  private storeCount = 0;
  private filterSet = false;
  @Output() reload = new EventEmitter<boolean>();

  /**
   * Creates an instance of FilterComponent.
   * @param {Router} router 
   * @param {ActivatedRoute} route 
   * @param {FilterService} filterService 
   * @param {ActionService} actionService 
   * @param {MdlDialogService} dialogService 
   * @param {CookieService} cookieService 
   * @param {StorageService} storageService 
   * 
   * @memberOf FilterComponent
   */
  constructor(public router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService,
    private actionService: ActionService,
    private dialogService: MdlDialogService,
    private cookieService: CookieService,
    private storageService: StorageService
  ) {
    this.showFilter = false;
  }

  /**
   * 
   * 
   * 
   * @memberOf FilterComponent
   */
  ngOnInit() {
    this.showFilter = false;
    this.filterSet = false;
    let that = this;
    this.filterService.getFilterList().
      subscribe((result: Array<FilterData>) => {
        that.filters = result;
        that.filterLoaded = true;
        that.restoreUserPreferenceFromCookie();
        let selectedItems = that.filters.filter(item => item.selected);
        if (selectedItems.length > 0) {
          that.filterSet = true;
        }
        else {
          this.filterSet = false;
        }
        that.storeCount = FilterDataHandler.getInstance().getSiteCountsForFilters(selectedItems);
      });
  }


  /**
   * 
   * 
   * 
   * @memberOf FilterComponent
   */
  closeFilter() {
    let filters: any = this.storageService.read('filter');
    try {
      let filterList: Array<any> = JSON.parse(filters);
      if (filterList != null && filterList.length > 0) {
        this.filters.map(filt => {
          filt.selected = false;
          if (_.find(filterList, function (o) { return o.filterId == filt.filterId; })) {
            filt.selected = true;
          }
        })
      } else {
        this.filters.map(filt => filt.selected = false);
      }
    } catch (e) {

    }
    this.showFilter = false;
  }

  /**
   * 
   * 
   * @param {any} event 
   * 
   * @memberOf FilterComponent
   */
  onFilterClick(event) {

    // let filterImg = document.getElementById('filterBtn');
    // this.fromoffsetTop = filterImg.getBoundingClientRect().top - 15;
    this.showFilter = true;
    this.restoreUserPreferenceFromCookie();


  }

  /**
   * 
   * 
   * 
   * @memberOf FilterComponent
   */
  restoreUserPreferenceFromCookie() {
    let filters = this.cookieService.getCookie('filter');
    try {
      let filterList: Array<any> = JSON.parse(filters);
      if (filterList != null && filterList.length > 0) {
        this.filters.map(filt => {
          if (_.find(filterList, function (o) { return o.filterId == filt.filterId; })) {
            filt.selected = true;
          }
        })
      } else {
        this.filters.map(filter => filter.selected = false);
      }
    } catch (e) {

    }
    let selectedItems = this.filters.filter(item => item.selected);
    if (selectedItems.length > 0) {
      this.filterSet = true;
    }
    else {
      this.filterSet = false;
    }
    this.storeCount = FilterDataHandler.getInstance().getSiteCountsForFilters(selectedItems);
  }

  /**
   * 
   * 
   * 
   * @memberOf FilterComponent
   */
  onSelect() {

    let selectedItems = this.filters.filter(item => item.selected);
    // if (selectedItems.length <= 0)
    //   FilterDataHandler.getInstance().clearFilter();
    // else
    //   FilterDataHandler.getInstance().setFilterData(selectedItems);

    this.storeCount = FilterDataHandler.getInstance().getSiteCountsForFilters(selectedItems);

  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf FilterComponent
   */
  applyFilter() {

    let selectedItems = this.filters.filter(item => item.selected);
    this.filterSet = false;


    this.storageService.write('filter', JSON.stringify(selectedItems));
    if (this.storeCount <= 0 && selectedItems.length > 0) {
      this.onDialogShow();
      return;
    }

    if (selectedItems.length > 0) {
      this.filterSet = true;
    }
    else {
      this.filterSet = false;
    }

    this.saveToCookie(selectedItems);
    if (selectedItems.length <= 0)
      FilterDataHandler.getInstance().clearFilter();
    else
      FilterDataHandler.getInstance().setFilterData(selectedItems);

    this.actionService.clearAll();
    this.showFilter = false;
    this.reload.emit();
  }

  /**
   * 
   * 
   * @param {any} selectedItems 
   * 
   * @memberOf FilterComponent
   */
  saveToCookie(selectedItems) {
    if (selectedItems) {
      //let filter = selectedItems.map(item => item.filterId).join();
      this.cookieService.setCookie('filter', JSON.stringify(selectedItems));
    } else {
      this.cookieService.deleteCookie('filter');
    }

  }

  /**
   * 
   * 
   * 
   * @memberOf FilterComponent
   */
  public onDialogShow() {
    let errorMessage = "The tags selected resulted in no sites found.";
    this.dialogService.alert(errorMessage);

  }

}
