import { CompanyComponent } from './company.component';
import { CompanyDetailComponent } from './detail/company.detail.component';
import { CompanyDetailResolver } from './detail/company.detail.resolver';

export const routes = [
  { path: '', 
    children: [
      { 
        path: '', 
        component: CompanyComponent 
      },
      { 
        path: 'detail/:id', 
        component: CompanyDetailComponent, 
        resolve: {
          company: CompanyDetailResolver
        } 
      },
      { 
        path: 'add', 
        component: CompanyDetailComponent, 
        resolve: {
          company: CompanyDetailResolver
        } 
      } 
    ]
  }
];