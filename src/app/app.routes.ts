import { AuthActivator } from './services/auth.activator';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  //   { path: '',      component: HomeComponent },
  //   { path: 'home',  component: HomeComponent },
  //   { path: 'about', component: AboutComponent },
  //   { path: 'detail', loadChildren: './+detail#DetailModule'},
  //   { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  //   { path: '**',    component: NoContentComponent },
  // ];

  { path: 'login', component: LoginComponent },

  // { path: 'signup', component: RegisterComponent},
  {
    path: '',
    component: HomeComponent,
    children: [

      {
        path: 'new-job',
        loadChildren: './job#JobModule',
         canActivate: [AuthActivator]
      },
       {
        path: 'message',
        loadChildren: './messages#MessageModule',
         canActivate: [AuthActivator]
      },
      {
        path: 'company',
        loadChildren: './company#CompanyModule',
         canActivate: [AuthActivator]
      },
      {
        path: 'campaign',
        loadChildren: './campaign#CampaignModule',
         canActivate: [AuthActivator]
      },
      {
        path: 'list',
        loadChildren: './list#ListModule',
         canActivate: [AuthActivator]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
         canActivate: [AuthActivator]
      },
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' }

    ]
  }
  // tslint:disable-next-line:eofline
];
