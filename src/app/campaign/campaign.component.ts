import { Component, OnInit, ViewChild, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'
import {CampaignService} from "./campaign.service";
import _ from "lodash";
import { Campaign } from './../model/campaign.model';

@Component({
  selector: 'campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit  {  
  private campaignService: CampaignService;
  private campaignList:any = [];
  private selectedItem:any = {};
  private selectedIndex:Number = -1;
  private sort: string = "";

  constructor(private router: Router, private activatedRoute:ActivatedRoute, campaignService: CampaignService) {    
    this.campaignService = campaignService;
  }

  ngOnInit() {
    this.loadCampaigns();
  }

  private loadCampaigns() {
    this.campaignService.loadCampaigns().subscribe( 
     (data) => {      
      this.campaignList  = data;
      this.onSortChange();
     } );
  }

  removeCampaign(id: string) {
    this.campaignService.removeCampaign(id).subscribe(()=>{
      this.loadCampaigns()
    })
  }

  onSortChange(){
    if(this.sort == "name") {
      this.campaignList.sort(this.compareByName);
    }
  }

  private compareByName(a:Campaign, b:Campaign) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }
  
  toggleEditMode(index) {
    this.selectedIndex = index;
    this.selectedItem = this.campaignList[index];
    this.router.navigate(['./detail/'+this.selectedItem._id],{relativeTo: this.activatedRoute});
  }

  newCampaign() {
    this.router.navigate(['./add'],{relativeTo: this.activatedRoute});
  }
}
