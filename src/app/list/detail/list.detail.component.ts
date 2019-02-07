import { Component, OnInit, ViewChild, Input, SimpleChanges, NgModule} from '@angular/core';
import { FormControl, FormsModule, NgForm,Validators } from "@angular/forms";
import {Router, ActivatedRoute} from '@angular/router'

import {ListService} from "../list.service";
import { WorkerList } from '../../model/list.model';
import {TagInputComponent} from 'angular2-tag-input';
import _ from "lodash";
import { CustomValidators } from '../../services/custom.validator';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ApiBuilder } from '../../services/api.builder.service';

@Component({
  selector: 'list-detail',
  templateUrl: './list.detail.component.html',
  styleUrls: ['./list.detail.component.css'],

})
export class ListDetailComponent implements OnInit  {  
  @ViewChild('listForm') listForm: NgForm;

  private listService: ListService;
  private list:WorkerList;
  private newMsg: String = "";
  
  public workerFilter: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public workerDataSource: Observable<any>;

  constructor(private router: Router, 
    private activatedRoute:ActivatedRoute, listService: ListService) {
    this.listService = listService;
  }

  ngOnInit() {
    this.activatedRoute.data.pluck('list').subscribe( (list: WorkerList) => {
      this.list = list;
    }, err => {});
    this.workerDataSource = Observable.create((observer: any) => {
        observer.next(this.workerFilter);
      }).mergeMap((filter: string) => this.getWorkers(filter));
  }

  saveCompaign() {
    let id = this.list._id;
    this.listService.saveList(this.list).subscribe( company => {
      if(id != null)
        this.router.navigate(['../../'],{relativeTo: this.activatedRoute});
      else
        this.router.navigate(['../'],{relativeTo: this.activatedRoute});
    }, err => {

    });
  }
    
  public getWorkers(token: string): Observable<any> {
    return this.listService.loadWorkers(token);
  }
 
  public loadingWorkers(e: boolean): void {
    this.typeaheadLoading = e;
  }
 
  public noWorkerFound(e: boolean): void {
    this.typeaheadNoResults = e;
  }
 
  public onSelectWorker(e: TypeaheadMatch): void {
    this.list.workers.push(e.item);
    this.workerFilter = "";
  }

  public removeWorker(index){
    this.list.workers.splice(index, 1);
  }
}
