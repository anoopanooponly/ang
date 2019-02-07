import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {CampaignService} from "../campaign.service";
import { Campaign } from '../../model/campaign.model';

@Injectable()
export class CampaignDetailResolver implements Resolve<Observable<Campaign>> {
  constructor(
    private campaignService: CampaignService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if(route.params.id)
      return this.campaignService.getCampaignDetail(route.params.id);
    else
      return Observable.of(this.campaignService.getEmptyCampaign());
  }
}
