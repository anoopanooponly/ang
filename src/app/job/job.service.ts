import { StorageService } from './../services/storage.service';
import { TimeService } from './../services/time.service';
import { Observable } from 'rxjs/Rx';
import { Category } from './../model/Category.model';
import { ApiBuilder } from './../services/api.builder.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
/**
 * Created by anoop on 07-06-2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class JobService {
  public job;
  private categories;
  private categoryList = new Array<Category>();
  private observable: Observable<any>;
  private observableOfView: Observable<any>;
  constructor(private http: Http, private apiBuilder: ApiBuilder, private timeService: TimeService, private storageService: StorageService) {
    
  }
  initJob(){
    this.job = {
      catid: "-1",
      startDate: new Date(),
      endDate: new Date(),
      company: {
     _id: "-1"
   },
    skills: [],
    selectedShift: {
      _id: "-1"
    },
    selectedWorkers: []
    };
  }
  // loadCategories(){
    
  //  this.http
  //           .get( this.apiBuilder + '/site/category/getCategoryList')
  //           .map(response => {
  //             this.categories = response;
  //           });
  // }
  
  
 loadCategories() {
    let that = this;

    if (this.categoryList != null && this.categoryList.length > 0) {
      return Observable.of(this.categoryList);
    } else if (this.observableOfView) {
      return this.observableOfView;
    } else {
      this.observableOfView = this.http
            .get( this.apiBuilder.getAPIBaseURL() + '/site/category/getCategoryList')
        .map(response => {
          let catList = new Array<Category>();
          let res = response.json();
          that.observableOfView = null;
          let rsponseStatus = response.status;
         catList.push(...res);
            
            that.categoryList = catList;
            return catList;
         
        })
        .share();
      return this.observableOfView;
    }
  }

  setJobDetails(job){
       this.job = job;
        this.storageService.write("job", this.job);
  }

  setJobDetailsAndUpdateLocalStorage(job){
       this.job = job;
       this.storageService.write("job", this.job);
  }

   getJobDetails(){
      return this.job;
  }

  public searchWorkers( catid, skillsArr) {
   let categoryid =  this.job.catid;
   let skills = skillsArr;
   let minvalue = this.job.wage;

  let selectedLoc = null;
  let lat = "0";
   let log = "0";
  if(this.job.company.locations != null) {
    selectedLoc = this.job.company.locations.filter(loc => loc._id == this.job.location);
   lat = selectedLoc[0].lat;
   log = selectedLoc[0].lng;
  }
   let day = {

   } ; 

   let dayOfDate= this.timeService.getDayOfDate(this.job.startDate);
  let diff = this.timeService.getDiffBetweenDates(this.job.startDate, this.job.endDate);
  let arr = this.timeService.getDaysBetween(diff, dayOfDate);
   
   let days = [];
  let start =  this.job.selectedShift.start;
   let end =  this.job.selectedShift.end;
   if(arr != null && arr.length > 0 ) {
    arr.map(function(day){
      days.push({
        "name": day,
        "start_time": start ,
        "end_time": end
        });
    });
   } else {
          days.push({
        "name": dayOfDate,
        "start_time": start ,
        "end_time": end
        });
   }

    
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers});
    
    
    
    var params = new URLSearchParams();
     params.append('skills', JSON.stringify(skills));
    params.append('days', JSON.stringify(days));
     params.append('minvalue', minvalue);
      params.append('maxvalue', '100');
       params.append('log', log);
       params.append('lat', lat);
       params.append('catId', catid);
       console.log("dayss:", JSON.stringify(days));
    return this.http.post(this.apiBuilder.getAPIBaseURL() + '/site/task/workerAvailabilitybyWorkingArea', params.toString(), options);

  }

}
