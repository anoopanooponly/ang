import { Component, OnInit, ViewChild, Input, SimpleChanges, NgModule} from '@angular/core';
import { FormControl, FormsModule, NgForm,Validators } from "@angular/forms";
import {Router, ActivatedRoute} from '@angular/router'

import {CampaignService} from "../campaign.service";
import { Campaign } from '../../model/campaign.model';
import {TagInputComponent} from 'angular2-tag-input';
import _ from "lodash";
import { CustomValidators } from '../../services/custom.validator';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ApiBuilder } from '../../services/api.builder.service';

@Component({
  selector: 'campaign-detail',
  templateUrl: './campaign.detail.component.html',
  styleUrls: ['./campaign.detail.component.css'],

})
export class CampaignDetailComponent implements OnInit  {  
  @ViewChild('campaignForm') campaignForm: NgForm;
  @ViewChild('messageForm') messageForm: NgForm;

  private campaignService: CampaignService;
  private campaign: Campaign;
  private campaignMessages = [];
  private newMsg: String = "";
  private avatar_home;
  
  public workerFilter: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public workerDataSource: Observable<any>;

  constructor(private router: Router, 
    private activatedRoute:ActivatedRoute, campaignService: CampaignService,
    private apiBuilder: ApiBuilder) {
    this.campaignService = campaignService;
    this.avatar_home = apiBuilder.getAPIBaseURL();
  }

  ngOnInit() {
    this.activatedRoute.data.pluck('campaign').subscribe( (campaign: Campaign) => {
      this.campaign = campaign;
    }, err => {});
    this.workerDataSource = Observable.create((observer: any) => {
        observer.next(this.workerFilter);
      }).mergeMap((filter: string) => this.getWorkers(filter));
  }

  saveCompaign() {
    let id = this.campaign._id;
    this.campaignService.saveCampaign(this.campaign).subscribe( company => {
      if(id != null)
        this.router.navigate(['../../'],{relativeTo: this.activatedRoute});
      else
        this.router.navigate(['../'],{relativeTo: this.activatedRoute});
    }, err => {

    });
  }
  
  sendMessage(){
    alert("sendMessage");
  }

  exportHistory(){
    alert("exportHistory");
  }
  
  public getWorkers(token: string): Observable<any> {
    return this.campaignService.loadWorkers(token);
  }
 
  public loadingWorkers(e: boolean): void {
    this.typeaheadLoading = e;
  }
 
  public noWorkerFound(e: boolean): void {
    this.typeaheadNoResults = e;
  }
 
  public onSelectWorker(e: TypeaheadMatch): void {
    if(e.item.type)
      this.campaign.lists.push(e.item);
    else
      this.campaign.workers.push(e.item);
    this.workerFilter = "";
  }

  public removeWorker(index){
    this.campaign.workers.splice(index, 1);
  }

  public removeList(index){
    this.campaign.lists.splice(index, 1);
  }
}
