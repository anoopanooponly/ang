/**********************************************************************************
* File Name   :   SettingsComponent.ts
* Description :   .
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Store } from './../../../model/store';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
import { TimeService } from './../../../services/time.service';
import { PeopleCountingData } from './../../../model/people-counting-data';
import { PeopleCountingService } from './../../../services/people-counting.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as _ from 'lodash';


@Component({
  selector: 'app-people-count-tab',
  styleUrls: ['./people-count-tab.component.scss'],
  templateUrl: './people-count-tab.component.html'
})
export class PeopleCountTabComponent implements OnInit {

  private selectedReportedBy = "day";
  private fromDate;
  private toDate;
  private selectedStore;
   private actionSub;
 // private isNan:string='';
  private list: any = new Array<PeopleCountingData>();
  private headers = [{ displayName: "Store Name (Address)", sort: "-1", name: "siteName" }, { displayName: "Date", sort: "-1", name: "date" }, { displayName: "Count", sort: "-1", name: "count" }];
  private sortOrder = false;
  private loaded = true;
  private sub;
  private peopleCountList: any = new Array<PeopleCountingData>();
  private reportRun = false;
  private storeListTag:any;
  private selectedDateRangeNormalFrom: string = '';
  private selectedDateRangeNormalTo: string = '';
  private myDateRangePickerOptionsNormal = {
    dateFormat: 'yyyy-mm-dd',
    showClearButton: true,
    width: '162px', 
    selectionTxtFontSize: '14px'

  };
  private dateValidationErr = false;
  private dateValidationMsg ="";
  
  
  /**
   * Creates an instance of PeopleCountTabComponent.
   * 
   * @param {ActivatedRoute} route
   * @param {PeopleCountingService} peopleCountingService
   * @param {TimeService} timeService
   * @param {ActionBarCommunicationService} actionBarComm
   * 
   * @memberOf PeopleCountTabComponent
   */
  constructor(private route: ActivatedRoute, 
              private peopleCountingService: PeopleCountingService,
              private timeService: TimeService,
              private actionBarComm: ActionBarCommunicationService) {
    let that = this;
    this.route.params.subscribe(params => {
      this.list = [];
      that.reportRun = false;
      that.loaded = true;
      that.selectedStore = '' + params['storeid'];
    });
    that=this;
 this.route.data
      .subscribe((dataStore: any) => {
      if(dataStore){
        let tag ="&site_id=";
        for (let i =0;i <dataStore.data.length;i++){

         tag =tag +dataStore.data[i].id;
          if (i<dataStore.data.length-1){
            tag=tag+',';
          }
        }
        this.storeListTag =tag;
      }
      });
   this.actionSub= this.actionBarComm.downloadSource$.subscribe(() => {
     that.download();
   })
    
  }
 ngOnDestroy() {
        this.actionSub.unsubscribe();
    }

   /**
    * 
    * 
    * 
    * @memberOf PeopleCountTabComponent
    */
   ngOnInit() {
   let current_time=this.timeService.getCurrentUTCTime();
  this.selectedDateRangeNormalTo=this.timeService.getdateonlyforpeoplecount(current_time,"US/Pacific");
  current_time=this.timeService.getPredate(current_time,1440);
  this.selectedDateRangeNormalFrom=this.timeService.getdateonlyforpeoplecount(current_time,"US/Pacific");
  if(this.selectedReportedBy!==''&&this.selectedDateRangeNormalFrom!==''&&this.selectedDateRangeNormalTo!==''){
    this.runReport();
  }
  }

 /**
  * Set the peoplecounting download links
  * 
  * @returns if form validation fails
  * 
  * @memberOf PeopleCountTabComponent
  */
 download() {
   if(!this.validateForm()) {
     return;
   }
   let url = this.peopleCountingService.getPeopleCountingDownloadLink(this.selectedReportedBy, this.selectedDateRangeNormalFrom, this.selectedDateRangeNormalTo);
   url= url+ this.storeListTag;
   this.downloadURL(url);
  }
  

/**
 * Download peoplecounting url
 * 
 * @param {any} url
 * 
 * @memberOf PeopleCountTabComponent
 */
downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader';
    var iframe = document.createElement('iframe');
    iframe.id = hiddenIFrameID;
    iframe.name = hiddenIFrameID;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.src = url;
  }


  /**
   * Set the calender to date 
   * 
   * @param {*} event
   * 
   * @memberOf PeopleCountTabComponent
   */
  onDateRangeChangedTo(event: any) {

   if (event.formatted !== '') {
    this.selectedDateRangeNormalTo = event.formatted;
      
    }
  }


  /**
   * Set the calender from date 
   * 
   * @param {*} event
   * 
   * @memberOf PeopleCountTabComponent
   */
  onDateRangeChangedFrom(event: any) {

   if (event.formatted !== '') {
      this.selectedDateRangeNormalFrom = event.formatted;
    }
  }
  

 

  /**
   *To sort in ascending or descending order 
   * 
   * @param {any} idx
   * 
   * @memberOf PeopleCountTabComponent
   */
  sortBy(idx) {
    this.headers.forEach(header => header.sort = "-1");
    let sortheader = this.headers[idx];
    if (sortheader != null) {
      this.sortOrder = !this.sortOrder;
      sortheader.sort = this.sortOrder ? "0" : "1";
      let sortVal = [].concat(sortheader.name);
      let sortOrder = [].concat(this.sortOrder ? "asc" : "desc");
      this.list = _.orderBy(this.list, sortVal, sortOrder);;
    }
  }


  /**
   * To validate form fields
   * 
   * @returns form validation status
   * 
   * @memberOf PeopleCountTabComponent
   */
  validateForm() {

    if(this.selectedDateRangeNormalFrom === null ||  this.selectedDateRangeNormalFrom === ''
       || this.selectedDateRangeNormalTo == null || this.selectedDateRangeNormalTo === '') {
       this.dateValidationErr = true;
      this.dateValidationMsg = "'From date' and 'To date' is mandatory.";
      return false;
    }
    let isToGTFRM = this.timeService.isStartDateIsGreater(this.selectedDateRangeNormalFrom, this.selectedDateRangeNormalTo);
    if (isToGTFRM) {
      this.dateValidationErr = true;
      this.dateValidationMsg = "'From date' should not be greater than 'To date'.";
      return false;
    }
    return true;
  }
  
 isNan(countNan:any):boolean{
   if(isNaN(countNan)){
     return true;
   }
  return false;
 }
  /**
   * Creates the report between the given dates
   * 
   * @returns when validation fails
   * 
   * @memberOf PeopleCountTabComponent
   */
  runReport() {
   
  
    this.dateValidationErr = false;
    this.dateValidationMsg = "";

   if(!this.validateForm()) {
     return;
   }
   this.reportRun = true;
    this.loaded = false;
    let that =this;
    if(this.sub) {
      console.log("unsubscribe");
       this.sub.unsubscribe();
    }
    if ((this.selectedStore == 'all') || (this.selectedStore == "undefined")) {
      this.sub = this.peopleCountingService.getCountDetailsOfAllStores(this.selectedReportedBy, this.selectedDateRangeNormalFrom, this.selectedDateRangeNormalTo,this.storeListTag).subscribe(peopleCountList => {
      /* peopleCountList.forEach(item => {
         if(isNaN( item.count)){
             this.isNan='error while loading'; 
          }
          else{
            this.isNan=null;
          }
         
        });*/
        that.list = peopleCountList;
       that.loaded = true;
      });

    }
    else {
     
      this.sub = this.peopleCountingService.getCountDetailsPerStore(this.selectedStore, this.selectedReportedBy, this.selectedDateRangeNormalFrom, this.selectedDateRangeNormalTo).subscribe(peopleCountList => {
        /* peopleCountList.forEach(item => {
         if(isNaN( item.count)){
             this.isNan='error while loading'; 
          }
          else{
            this.isNan=null;
          }
         
        });*/
        that.list = peopleCountList;
        that.loaded = true;
      });

    }
  }

}
