
/**********************************************************************************
* File Name   :   AppComponent.ts
* Description :   This angular component represents the card view where the video gallery is rendered.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { Router , Event as RouterEvent, NavigationStart, NavigationEnd} from '@angular/router';
//var videojs = require('video.js');
//require('videojs-contrib-hls');
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
 styleUrls: [
    './app.component.css',
    '../theme.scss',
    '../layout.scss'
  ],
  templateUrl: './app.component.html',
  viewProviders: []
  
})
export class AppComponent {
  
  loading: boolean = true;
 
  constructor(
    public appState: AppState, private router: Router) {
router.events.subscribe((event:RouterEvent) => {
        this.navigationInterceptor(event);
    });
  }

// Shows and hides the loading spinner during RouterEvent changes
    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.loading = true;
        }
        if (event instanceof NavigationEnd) {
            this.loading = false;
        }
        // Additionally there's NavigationCancel and NavigationError, set loading false for these events
    }
 
  ngOnInit() {
    //console.log('Initial App State', this.appState.state);
  }

}

