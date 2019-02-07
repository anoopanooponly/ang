import { StorageService } from './../../services/storage.sevice';

/**********************************************************************************
* File Name   :   HomeComponent.ts
* Description :   This angular component represents the main view once logged in. 
                  The template for this component renders menu bar, sidebar, progress bar and
                  a main area ,which is the place holder for all other components.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { HeatmapService } from './../../services/heatmap.service';
import { ActionService } from './../../services/action.service';
import { CookieService } from './../../services/cookie.service';
import { LoginService } from './../../services/login.service';
import { ActionBarCommunicationService } from './../../services/actionbar.communication.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router'
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { MdButtonModule } from '@angular/material/button';
import { MdButtonToggleModule } from '@angular/material/button-toggle';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs/Observable';

@Component({

    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [LoginService]

})
export class HomeComponent {
    UserName: string;
    loading: boolean = true;
    type;
    isSettings: boolean = false;
    playBack: boolean;
    calObj = {
        playBack: true
    }

    /**
     * Creates an instance of HomeComponent.
     * @param {Router} router 
     * @param {LoginService} loginService 
     * @param {ActivatedRoute} route 
     * @param {CookieService} cookieService 
     * @param {ActionService} actionService 
     * @param {HeatmapService} heatmapService 
     * @param {ActionBarCommunicationService} actionBarCommunicationService 
     * 
     * @memberOf HomeComponent
     */
    constructor(public router: Router,
        private loginService: LoginService,
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private actionService: ActionService,
        private heatmapService: HeatmapService,
        private actionBarCommunicationService: ActionBarCommunicationService,
        private storageService: StorageService) {

        this.setDefaultPlayBack();

        this.UserName = Cookie.get('UserEmail');
        this.loading = true;
        this.type = Observable.of(true);
        this.router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });
    }

    setDefaultPlayBack() {

        let settings: any = this.storageService.read('Settings');//this.cookieService.getCookiePlayBacklocal();
        if (settings == null) {
            this.calObj.playBack = true;
            this.storageService.write("Settings", JSON.stringify(this.calObj));
        }

    }


    /**
     * Shows and hides the loading spinner during RouterEvent changes
     * 
     * @param {RouterEvent} event 
     * 
     * @memberOf HomeComponent
     */
    navigationInterceptor(event: RouterEvent): void {

        if (event instanceof NavigationStart) {
            this.loading = true;

        }
        if (event instanceof NavigationEnd) {
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf HomeComponent
     */
    logout() {
        Cookie.set('IsValidUser', "No");
        Cookie.set('UserEmail', null);
        var that = this;
        this.loginService.logout()
            .subscribe(
            authData => {
                if (authData.logoutStatus) {
                    that.router.navigate(['/login']);
                    that.cookieService.clearAllCookies();
                    that.actionService.clearAll();
                    that.heatmapService.comparisonWindowOpen = false;
                    that.heatmapService.singleCameraView = false;
                    that.heatmapService.clearStorage();
                }
                else {
                    //console.log('logout Failed' + authData.error);
                }
            },
            error => { }
            );


    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf HomeComponent
     */
    isView() {
        return this.type.subscribe(val => {
            return val;
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf HomeComponent
     */
    onScrollDown() {
        this.actionBarCommunicationService.onscroll();
    }

    onScrollUp() {
    }

    /**
     * 
     * 
     * 
     * @memberOf HomeComponent
     */
    onSettings() {

        this.isSettings = true;
    }

    /**
     * 
     * 
     * @param {any} event 
     * 
     * @memberOf HomeComponent
     */
    public settingsButtonClick(event) {
        if (event == true) {
            this.isSettings = false;
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf HomeComponent
     */
    onVideoClick() {

        this.actionBarCommunicationService.action("false");
    }
}
