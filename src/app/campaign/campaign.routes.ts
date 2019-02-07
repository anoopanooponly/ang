import { CampaignComponent } from './campaign.component';
import { CampaignDetailComponent } from './detail/campaign.detail.component';
import { CampaignDetailResolver } from './detail/campaign.detail.resolver';

export const routes = [
  { path: '', 
    children: [
      { 
        path: '', 
        component: CampaignComponent 
      },
      { 
        path: 'detail/:id', 
        component: CampaignDetailComponent, 
        resolve: {
          campaign: CampaignDetailResolver
        } 
      },
      { 
        path: 'add', 
        component: CampaignDetailComponent, 
        resolve: {
          campaign: CampaignDetailResolver
        } 
      } 
    ]
  }
];