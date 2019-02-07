/**********************************************************************************
* File Name   :   FilterService.ts
* Description :   This class implements API client interface for Filters, which enables 
*                 the components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 20-Dec-2016      QuEST Team          Initial version created
**********************************************************************************/
import { FilterDataHandler } from './../utilities/filter-data-handler';
import { FilterData } from './../model/filter-data';
import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ApiBuilder } from './../utilities/api-builder';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FilterService {
  private result;
  private filterList = new Array<FilterData>();
  private observableOfFilter: Observable<any>;
  private RET_SUCCESS = 200;
  /**
   * Creates an instance of FilterService.
   * @param {Http} http 
   * 
   * @memberOf FilterService
   */
  constructor(private http: Http) {
    this.getFilterList();
  }


  /**
   * Return the filter list 
   * 
   * @returns 
   * 
   * @memberOf FilterService
   */
  getFilterList() {
    let api = ApiBuilder.getInstance();
    let filterDataHandler = FilterDataHandler.getInstance();
    let filterDataUrl = "api/site_tags?order_by=name&include=sites_with_devices_count,sites" + (filterDataHandler.getOrganization() != null ? filterDataHandler.getOrganization() : '');
    let that = this;

    if (this.filterList != null && this.filterList.length > 0) {
      return Observable.of(this.filterList);
    } else if (this.observableOfFilter) {
      return this.observableOfFilter;
    } else {
      this.observableOfFilter = this.http
        .get(filterDataUrl, {})
        .map(response => {
          let res = response.json();
          let reponseStatus = response.status;
          if (reponseStatus == this.RET_SUCCESS) {
            let siteTagList = res.data.site_tags;

            for (let i = 0; i < siteTagList.length; i++) {
              let filterData = new FilterData;
              let sites = new Array<string>();
              filterData.filterId = siteTagList[i].id;
              filterData.filterName = siteTagList[i].name;
              let sitesInfo = siteTagList[i].sites;
              filterData.siteCount = siteTagList[i].sites_with_devices_count;
              for (let j = 0; j < sitesInfo.length; j++) {
                sites.push(sitesInfo[j].id);
              }
              filterData.siteIdList = sites;
              this.filterList.push(filterData);
            }
          }
          else {
          }
          return this.filterList;
        }).share();
    }
  }

  /**
   * Clear Filter Data list
   * 
   * 
   * @memberOf FilterService
   */
  clearFilterList() {
    this.filterList = [];
  }

}
