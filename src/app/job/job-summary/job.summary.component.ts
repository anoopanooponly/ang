import { StorageService } from './../../services/storage.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TabsetComponent, RatingComponent } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap';
import {JobService} from "../job.service";

@Component({
  selector: 'app-job-summary',
  templateUrl: './job.summary.component.html',
  styleUrls: ['./job.summary.component.css']
})
export class JobSummaryComponent implements OnInit {
  @Input() startDate: Date = new Date();
  @Input() startTime: Date = new Date();
  @Input() endTime: Date = new Date();
  @ViewChild('childModal') public childModal:ModalDirective;
  jobService: JobService;
  public job;
  private location;
  public rate: number = 4;

  constructor(jobService: JobService, private storageService: StorageService) { 
    this.jobService = jobService;
    
  }

  ngOnInit() {
   this.job = this.jobService.getJobDetails();
    if(this.job == null) {
      this.job = this.storageService.read("job");
      this.jobService.setJobDetails(this.job);
    }
    let location = this.job.company.locations.filter(loc => {
      return loc._id ==  this.job.location;
    });
    if(location != null && location.length > 0) {
      this.location = location[0];
    }
  }

getTimeIn12HrFormat(time: number){
    let hours = time|0;
    let mm = Math.round((time - hours) * 100);
    let hh = hours%12;
    let mode = hours/12|0;
    let ret = "" + (hh == 0 ? (mode == 1 ? "12" : "00"): hh);
    ret += mm > 0 ? ":" + mm : "";
    return ret + " " + (mode == 1 ? "pm" : "am");
  }

    getShiftRepeatDesc(shift: any) {
    let desc = {
      arr: new Array(),
      start: "",
      end: ""
    };
    this.getDayDesc("Sunday", shift.days.Sunday, desc);
    this.getDayDesc("Monday", shift.days.Monday, desc);
    this.getDayDesc("Tuesday", shift.days.Tuesday, desc);
    this.getDayDesc("Wednesday", shift.days.Wednesday, desc);
    this.getDayDesc("Thursday", shift.days.Thursday, desc);
    this.getDayDesc("Friday", shift.days.Friday, desc);
    this.getDayDesc("Saturday", shift.days.Saturday, desc);
    let str:string;
    if(desc.start == "Sunday" && desc.end == "Saturday" )
      str = "Daily";
    else {      
      if(desc.start.length > 0){
        if(desc.start == desc.end)
          desc.arr.push(desc.start);
        else
          desc.arr.push(desc.start + " to " + desc.end);
      }
      str = "Weekly on " + desc.arr.join(", ");
    }
    return str;
  }
 
 getDayDesc(name, flag, desc) {
    if (flag) {
      if(desc.start.length == 0)
        desc.start = name;
      desc.end = name;  
    } else {
      if(desc.start.length > 0) {
        this.pushRepeatString(desc);
        desc.start = "";
        desc.end = "";
      }
    }
  }

  pushRepeatString(desc) {
    if(desc.start == desc.end)
      desc.arr.push(desc.start);
    else
      desc.arr.push(desc.start + " to " + desc.end);
  }

  public addShift(){
    this.showChildModal();
  }
 
  public showChildModal():void {
    this.childModal.show();
  }
 
  public hideChildModal():void {
    this.childModal.hide();
  }
}
