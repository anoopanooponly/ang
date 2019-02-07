import { Component, OnInit, ViewChild, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'
import {ListService} from "./list.service";
import _ from "lodash";
import { WorkerList } from './../model/list.model';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit  {  
  private listService: ListService;
  private taskerLists:any = [];
  private selectedItem:any = {};
  private selectedIndex:Number = -1;
  private sort: string = "";

  constructor(private router: Router, private activatedRoute:ActivatedRoute, listService: ListService) {    
    this.listService = listService;
  }

  ngOnInit() {
    this.loadLists();
  }

  private loadLists() {
    this.listService.loadLists().subscribe( 
     (data) => {      
      this.taskerLists  = data;
      this.onSortChange();
     } );
  }

  removeCompany(id: string) {
    this.listService.removeList(id).subscribe(()=>{
      this.loadLists()
    })
  }

  onSortChange(){
    if(this.sort == "name") {
      this.taskerLists.sort(this.compareByName);
    }
  }

  private compareByName(a:WorkerList, b:WorkerList) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }
  
  toggleEditMode(index) {
    this.selectedIndex = index;
    this.selectedItem = this.taskerLists[index];
    this.router.navigate(['./detail/'+this.selectedItem._id],{relativeTo: this.activatedRoute});
  }

  newList() {
    this.router.navigate(['./add'],{relativeTo: this.activatedRoute});
  }
}
