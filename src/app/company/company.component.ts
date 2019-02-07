import { Component, OnInit, ViewChild, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'
import {CompanyService} from "./company.service";
import _ from "lodash";
import { Company } from './../model/company.model';

@Component({
  selector: 'company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit  {  
  private companyService: CompanyService;
  private companyList:any = [];
  private selectedItem:any = {};
  private selectedIndex:Number = -1;
  private sort: string = "";

  constructor(private router: Router, private activatedRoute:ActivatedRoute, companyService: CompanyService) {    
    this.companyService = companyService;
  }

  ngOnInit() {
    this.loadCompanies();
  }

  private loadCompanies() {
    this.companyService.loadCompanies().subscribe( 
     (data) => {      
      this.companyList  = data;
      this.onSortChange();
     } );
  }

  removeCompany(id: string) {
    this.companyService.removeCompany(id).subscribe(()=>{
      this.loadCompanies()
    })
  }

  onSortChange(){
    if(this.sort == "name") {
      this.companyList.sort(this.compareByName);
    }
  }

  private compareByName(a:Company, b:Company) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }
  
  toggleEditMode(index) {
    this.selectedIndex = index;
    this.selectedItem = this.companyList[index];
    this.router.navigate(['./detail/'+this.selectedItem._id],{relativeTo: this.activatedRoute});
  }

  newCompany() {
    this.companyService.setCompany({
      shifts: []
    });
    this.router.navigate(['./add'],{relativeTo: this.activatedRoute});
  }
}
