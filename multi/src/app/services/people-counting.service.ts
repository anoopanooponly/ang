import { ActionService } from './action.service';
import { FilterDataHandler } from './../utilities/filter-data-handler';
import { TimeService } from './time.service';
import { PeopleCountingData } from './../model/people-counting-data';
import { Injectable } from '@angular/core';
import { ApiBuilder } from './../utilities/api-builder';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
TimeService
import * as _ from 'lodash';

@Injectable()
export class PeopleCountingService {

  /**
   * Creates an instance of PeopleCountingService.
   * @param {Http} http 
   * @param {TimeService} timeService 
   * @param {ActionService} actionService 
   * 
   * @memberOf PeopleCountingService
   */
  constructor(private http: Http, private timeService: TimeService, private actionService: ActionService) { }

  /**
   * Get count for all stores
   * 
   * @param {string} countType 
   * @param {string} startDate 
   * @param {string} endDate 
   * @param {string} siteTag 
   * @returns 
   * 
   * @memberOf PeopleCountingService
   */
  getCountDetailsOfAllStores(countType: string, startDate: string, endDate: string,siteTag:string) {
    let api = ApiBuilder.getInstance();
    let filterData = FilterDataHandler.getInstance();
    let filterQuery = filterData.filterQuery;
    let peopleCoutingurl = api.getPeopleCountingGenericURLForAllStores();
    let startTime = startDate + "T00:00:00";
    let endTime =  this.timeService.addtDates(endDate,1) + "T00:00:00";
    peopleCoutingurl = peopleCoutingurl.replace("COUNT_TYPE", countType);
    peopleCoutingurl = peopleCoutingurl.replace("START_TIME", startTime);
    peopleCoutingurl = peopleCoutingurl.replace("END_TIME", endTime);
    peopleCoutingurl=peopleCoutingurl+siteTag;

    let that = this;
    return this.http
      .get(peopleCoutingurl, {})
      .map(response => {
        let res = response.json();
        let peopleCountList = new Array<PeopleCountingData>();
        let reponseStatus = response.status;
        if (reponseStatus == 200) {
          let objectCount = res.data.object_counts;
          for (let i = 0; i < objectCount.length; i++) {
            let peopleCountingDate = new PeopleCountingData();
            peopleCountingDate.count =objectCount[i].object_count;
            peopleCountingDate.siteId = objectCount[i].site_id;
            peopleCountingDate.siteName = objectCount[i].site_name;
            peopleCountingDate.timezone = objectCount[i].site_timezone;
            let utc = objectCount[i].local_start_time;
            peopleCountingDate.date = this.timeService.getDateOnlyFromUTC(utc);

            let indx = _.findIndex(peopleCountList, { 'date': peopleCountingDate.date, 'siteId': peopleCountingDate.siteId });
            if (indx == -1) {
              peopleCountList.push(peopleCountingDate);
            } else {
              peopleCountList[indx].count = Number(peopleCountList[indx].count) + Number(peopleCountingDate.count);
            }
          }

        }
        return peopleCountList;
      }
      )//.subscribe(result => console.log('Subscribe'));

  }

  /**
   * Get count for given store
   * 
   * @param {string} storeId 
   * @param {string} countType 
   * @param {string} startDate 
   * @param {string} endDate 
   * @returns 
   * 
   * @memberOf PeopleCountingService
   */
  getCountDetailsPerStore(storeId: string, countType: string, startDate: string, endDate: string) {
    let api = ApiBuilder.getInstance();
     let peopleCoutingurl = api.getPeopleCountingGenericURLPerStore();
     let startTime = startDate + "T00:00:00";
    let endTime =  this.timeService.addtDates(endDate,1) + "T00:00:00";
   // let endTime = endDate + "T00:00:00";
    peopleCoutingurl = peopleCoutingurl.replace("COUNT_TYPE", countType);
    peopleCoutingurl = peopleCoutingurl.replace("START_TIME", startTime);
    peopleCoutingurl = peopleCoutingurl.replace("END_TIME", endTime);
    peopleCoutingurl = peopleCoutingurl.replace("SITE_ID", storeId);

    let that = this;
    return this.http
      .get(peopleCoutingurl, {})
      .map(response => {

        let res = response.json();

        let peopleCountList = new Array<PeopleCountingData>();
        let reponseStatus = response.status;
        if (reponseStatus == 200) {
          let objectCount = res.data.object_counts;
          for (let i = 0; i < objectCount.length; i++) {
            let peopleCountingDate = new PeopleCountingData();
           peopleCountingDate.count =objectCount[i].object_count;
           peopleCountingDate.siteId = objectCount[i].site_id;
            peopleCountingDate.siteName = objectCount[i].site_name;
            peopleCountingDate.timezone = objectCount[i].site_timezone;
            let utc = objectCount[i].local_start_time;
            peopleCountingDate.date = this.timeService.getDateOnlyFromUTC(utc);

            let indx = _.findIndex(peopleCountList, { 'date': peopleCountingDate.date, 'siteId': peopleCountingDate.siteId });
            if (indx == -1) {
              peopleCountList.push(peopleCountingDate);
            } else {
              peopleCountList[indx].count = Number(peopleCountList[indx].count) + Number(peopleCountingDate.count);
            }

          }
        }
        return peopleCountList;
      }
      )//.subscribe(result => console.log('Subscribe'));

  }

  /**
   * Get download link for people count
   * 
   * @param {string} countType 
   * @param {string} startDate 
   * @param {string} endDate 
   * @returns 
   * 
   * @memberOf PeopleCountingService
   */
  getPeopleCountingDownloadLink(countType: string, startDate: string, endDate: string) {
    let api = ApiBuilder.getInstance();
    let peopleCoutingurl = api.getPeopleCountingDownloadURL();
    let startTime = startDate + "T00:00:00";
     let endTime =  this.timeService.addtDates(endDate,1) + "T00:00:00";
   // let endTime = endDate + "T00:00:00";
    peopleCoutingurl = peopleCoutingurl.replace("COUNT_TYPE", countType);
    peopleCoutingurl = peopleCoutingurl.replace("START_TIME", startTime);
    peopleCoutingurl = peopleCoutingurl.replace("END_TIME", endTime);
    return peopleCoutingurl;
  }

}
