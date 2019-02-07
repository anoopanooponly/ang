import { StorageService } from './../../services/storage.service';
import { Company } from './../../model/company.model';
import { CompanyService } from './../../company/company.service';
import { Category } from './../../model/Category.model';
import { Component, OnInit, ViewChild, DoCheck, Input, SimpleChanges} from '@angular/core';
import {JobService} from "../job.service";
import {TagInputComponent} from 'angular2-tag-input';
import { ModalDirective } from 'ngx-bootstrap';
import _ from "lodash";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],

})
export class JobComponent implements OnInit, DoCheck  {  
  @Input() startTime: Date = new Date();
  @Input() endTime: Date = new Date();


  private jobService: JobService;
  private categoryList = new Array<Category>();
  private companyList = new Array<Company>();
  public job;
  public autocompleteTags = [];
  public autocompleteItems = [];
  public uiState = {
    startDateOpen: false,
    endDateOpen: false
  };
  //bkpStartTime;

  constructor(jobService: JobService, private companyService: CompanyService, private storageService: StorageService) { 
    this.jobService = jobService;
    
    if(jobService.job == null){
      jobService.initJob();
    }
    this.job = jobService.job;
    let that = this;
    this.companyService.loadCompanies().subscribe(companies => {
       that.companyList.push(...companies);
       console.log("this.companyList", that.companyList);
    });
    //this.bkpStartTime = this.startTime;
  }

  ngOnInit() {
   this.jobService.loadCategories().subscribe( 
     (data) => {
       this.categoryList  = data;
     } );

     if(this.job.skills != null && this.job.skills.length > 0) {
       this.job.skills.map(item => {
          this.autocompleteTags.push(item.name);
       })
      
     }
  }

  public toggleUIState(property, $event: MouseEvent): void {
    this.uiState[property] = !this.uiState[property];
  }

  onchange(item) {
       let selectedCat = this.categoryList.filter(cat => cat._id == item); 
       this.autocompleteItems = [];
        selectedCat[0].category.map(sub => {
           this.autocompleteItems.push(sub.name);
        });
  }

 itemSelected(item) {
   console.log("item", item );
 }
 
 oncompanySelect(item) {
    let selectedCompany = this.companyList.filter(company => company._id == item); 
    this.job.company = selectedCompany[0];
    this.job.selectedShift._id = "-1";
 }
  ngDoCheck() {
  /*if(this.startTime.getHours() != this.bkpStartTime.getHours()){
    console.log("hour changed from "+this.bkpStartTime.getHours()+" to "+this.startTime.getHours()+".")
  }*/
}

  saveJob() {
      
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
              this.jobService.setJobDetailsAndUpdateLocalStorage(this.job);
          }
        }
      )
    
  }

  onshiftSelect(item) {

    if(this.job != null && this.job.company != null) {
        let selectedshift = this.job.company.shifts.filter(shift => shift._id == item); 
        this.job.selectedShift = selectedshift[0];
    }
   
  }

  save() {
    this.jobService.setJobDetailsAndUpdateLocalStorage(this.job);
   
  }
}
