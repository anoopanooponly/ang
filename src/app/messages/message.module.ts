import { MessageService } from './message.service';
import { HttpService } from './../services/http.service';
import { MessageComponent } from './message/message.component';
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

import { routes } from './message.route';


console.log('`Message` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
  MessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RlTagInputModule,
    RouterModule.forChild(routes),
    TabsModule.forRoot()    
  ],
  providers:    [ HttpService, MessageService ]
})
export class MessageModule {
   public static routes = routes;
}