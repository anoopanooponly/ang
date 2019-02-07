import { StorageService } from './../../services/storage.service';
import { ApiBuilder } from './../../services/api.builder.service';
import { Category } from './../../model/Category.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent, RatingComponent } from 'ngx-bootstrap';
import { JobService } from "../job.service";
import _ from "lodash";

@Component({
  selector: 'app-job',
  templateUrl: './job.worker.component.html',
  styleUrls: ['./job.worker.component.css']
})
export class JobWorkerComponent implements OnInit {
  jobService: JobService;
  job;
  public rate: number = 4;
  public autocompleteTags = [];
  public autocompleteItems = [];
  private categoryList = new Array<Category>();
  private workers = [];
  private selectedWorker = null;
  private selectedWorkers = [];

  constructor(jobService: JobService,public apiBuilder: ApiBuilder, public storageService: StorageService) {
    this.jobService = jobService;

  }

  ngOnInit() {
    this.job = this.jobService.getJobDetails();
    if(this.job == null) {
      this.job = this.storageService.read("job");
      this.jobService.setJobDetails(this.job);
    }
    console.log("jobs:", this.job);
    this.jobService.loadCategories().subscribe(
      (data) => {
        this.categoryList = data;
        this.onchange(this.job.catid);
      });

    this.seachWorkers();
  }

  setSelectedWorker(selectedWorker) {
    if(selectedWorker.selected == null || selectedWorker.selected == undefined) {
      selectedWorker.selected = true;
    } else {
    selectedWorker.selected = !selectedWorker.selected;
    }
    if(selectedWorker.selected)
     this.selectedWorker= selectedWorker;
     else
     this.selectedWorker = null;
  }

  hireWorker(worker) {
    if(this.job.selectedWorkers == undefined) {
      this.job.selectedWorkers = [];
    }
    if(this.job.selectedWorkers.indexOf(worker) == -1){
     this.job.selectedWorkers.push(worker);
    }
  }

   removeWorker(worker) {
    _.remove(this.job.selectedWorkers, function(currentObject: any) {
    return currentObject.id === worker.id;
});
  }

  onchange(item) {
    let selectedCat = this.categoryList.filter(cat => cat._id == item);
    this.autocompleteItems = [];
    selectedCat[0].category.map(sub => {
      this.autocompleteItems.push(sub.name);
    });
  }

  itemSelected(tag) {
    console.log("item", this.autocompleteTags);
  }

  itemRemoved(tag) {
    console.log("item", this.autocompleteTags);
    this.seachWorkers();
  }

  private seachWorkers(skills = []) {
   this.jobService.searchWorkers(this.job.catid, skills).subscribe(data => {
       let obj =  data.json();
       this.workers = obj.result;
       this.workers.map(worker => {
         worker.avatar = this.apiBuilder.getAPIBaseURL() + worker.avatar;
         if(worker.reviews != null && worker.reviews.documentData != null && worker.reviews.documentData.length > 0) {
           worker.reviews.documentData.map(review => {
            review.userdetails.avatar = this.apiBuilder.getAPIBaseURL() + review.userdetails.avatar;
           });
         }
       });
    });
  }

  filterWorkers() {
          let selectedSkills = [];
      this.autocompleteTags.map(item => {
        selectedSkills.push({name: item});
      })
      let selectedCat = this.categoryList.filter(cat => cat._id == this.job.catid).map(
        cat => {
          if(cat.category != null && cat.category.length > 0) {
              let skills = _.intersectionBy(cat.category, selectedSkills, "name");
              let skillArr = [];
              skills.map(skill => {
                skillArr.push(skill._id);
              });
              this.seachWorkers(skillArr);
          }
        }
      )
  }

  gotoSummary() {
    //this.job.workers = this.selectedWorkers;
    this.jobService.setJobDetailsAndUpdateLocalStorage(this.job);
  }


}
