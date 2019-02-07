import { RlTagInputModule } from 'angular2-tag-input/lib/tag-input.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MomentModule } from 'angular2-moment';

import { routes } from './company.routes';
import { CompanyService } from "./company.service";
import { CompanyComponent } from './company.component';
import { CompanyDetailComponent } from './detail/company.detail.component';
import { CompanyDetailResolver } from './detail/company.detail.resolver';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SharedModule } from '../shared/shared.module';

console.log('`Company` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    CompanyComponent,
    CompanyDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RlTagInputModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot(),
    RatingModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    MomentModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyArM6hnVQg7pdbDBeYBi5d2yaBLUXZSlnA',
      libraries: ["places"]
    }),
    ReactiveFormsModule,
    AccordionModule.forRoot(),
    SharedModule
  ],
  providers:    [ CompanyService, CompanyDetailResolver]
})
export class CompanyModule {
  public static routes = routes;
}