
/**********************************************************************************
* File Name   :   ViewsComponent.ts
* Description :   This angular component represents the card view where the video gallery is rendered.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,trigger,transition,state,animate,style} from '@angular/core';
import { Router, Event as RouterEvent, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/observable/forkJoin';
import { ActionService } from './../../../services/action.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.css']

 

})
export class ViewsComponent implements OnInit {
errorImg = "assets/img/thumbnail-error-small.png";
  store: any;

  /**
   * Creates an instance of ViewsComponent.
   * @param {ActivatedRoute} route 
   * @param {Router} router 
   * @param {ActionService} actionService 
   * 
   * @memberOf ViewsComponent
   */
  constructor(public route: ActivatedRoute,
    public router: Router, public actionService: ActionService) {

  }


  /**
   * 
   * 
   * 
   * @memberOf ViewsComponent
   */
  ngOnInit() {

  }

  onScroll() {
    // console.log("on scroll");
  }
}
