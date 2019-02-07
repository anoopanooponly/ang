import { RlTagInputModule } from 'angular2-tag-input/lib/tag-input.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import { routes } from './job.routes';
import { JobService } from "./job.service";
import { JobComponent } from './job/job.component';
import { JobWorkerComponent } from './job-worker/job.worker.component';
import { JobSummaryComponent } from './job-summary/job.summary.component';

console.log('`Job` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    JobComponent,
    JobWorkerComponent,
    JobSummaryComponent
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
    MomentModule
  ],
  providers:    [ JobService ]
})
export class JobModule {
  public static routes = routes;
}