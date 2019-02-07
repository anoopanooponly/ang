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

import { routes } from './list.routes';
import { ListService } from "./list.service";
import { ListComponent } from './list.component';
import { ListDetailComponent } from './detail/list.detail.component';
import { ListDetailResolver } from './detail/list.detail.resolver';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SharedModule } from '../shared/shared.module';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

console.log('`List` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    ListComponent,
    ListDetailComponent
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
    SharedModule,
    TypeaheadModule.forRoot()   
  ],
  providers:    [ ListService, ListDetailResolver]
})
export class ListModule {
  public static routes = routes;
}