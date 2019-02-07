
/**********************************************************************************
* File Name   :   CreateClipComponent.ts
* Description :   This angular component renders the video tab actionbar which hold stores/view selection
                  filter,calendar, clip creation etc.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { Directive, Renderer } from 'angular2/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PathLocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { inject } from '@angular/core/testing';

import { PlayerService } from './../../../services/player.service';
import { VideoService } from './../../../services/video.service';
import { ActionService } from './../../../services/action.service';
import { DateFormat } from './../../../model/date-format';
import { View } from './../../../model/view';
import { CookieService } from './../../../services/cookie.service';
import { GalleryService } from './../../../services/gallery.service';
import { Store } from './../../../model/store';
import { HeatmapService } from './../../../services/heatmap.service';
import { ActionBarCommunicationService } from './../../../services/actionbar.communication.service';
// import { ViewsComponent } from './../views/views.component';
// import { PlayerCalendarComponent } from './../player-calendar/player-calendar.component';
// import { TimeService } from './../../services/time.service';

@Component({
    selector: 'app-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.css'],
    providers: [GalleryService, CookieService]

})
export class ActionComponent {

    stores: Array<Store> = [];


    views: Array<View> = [];
    public component: any;
    mode: string = '1';
    mode1: string = '1';
    public hasStoreSelected: boolean;
    public selectedStore: string;
    public selectedView: string;
    public placeHolderStore;
    public placeHolderView;
    public isVideoplayer: boolean = false;
    public popupHidden: boolean;
    public playerDate: string;
    public title: string;
    private val = false;
    defaultCalendarDate: DateFormat;
    private actionSub;
    private rightPos = 0;

    /**
     * Creates an instance of ActionComponent.
     * @param {Router} router 
     * @param {ActionService} actionService 
     * @param {VideoService} videoService 
     * @param {GalleryService} galleryService 
     * @param {ActivatedRoute} route 
     * @param {CookieService} cookieService 
     * @param {ActionBarCommunicationService} actionBarCommunicationService 
     * @param {HeatmapService} heatmapService 
     * @param {PlayerService} playerService 
     * 
     * @memberOf ActionComponent
     */
    constructor(public router: Router,
        private actionService: ActionService,
        private videoService: VideoService,
        private galleryService: GalleryService,
        private route: ActivatedRoute,
        private cookieService: CookieService,
        private actionBarCommunicationService: ActionBarCommunicationService,
        private heatmapService: HeatmapService, private playerService: PlayerService) {


        this.intializeStoreAndView();
        this.restoreState();
        let that = this;
        this.heatmapService.calendarPopupOn = false;
        let videoType = this.cookieService.getCookieVideoType();
        this.hasStoreSelected = videoType == 'store' ? true : false;

        if (this.videoService.getSelectedVideoSource() != null && this.videoService.getSelectedVideoSource() != 'undefined') {

            that.isVideoplayer = true;

        }
        this.actionSub = actionBarCommunicationService.actionSource$.subscribe((obj) => {
            if (obj == "true") {
                that.isVideoplayer = true;
                that.actionService.isPlayer = true;
            }

            if (obj == "false") {
                that.isVideoplayer = false;
                that.actionService.isPlayer = false;
                that.actionService.PopupHidden = false;


            }

            if (obj == "reload") {
                this.reload();
            }
        });

    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf ActionComponent
     */
    private onCalendarClick() {
        // this.popupHidden = false;
        this.actionService.PopupHidden = true;

    }

    /**
     * 
     * 
     * 
     * @memberOf ActionComponent
     */
    ngOnInit() {
        this.rightPos = this.getScrollBarWidth();
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf ActionComponent
     */
    getScrollBarWidth() {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild(outer);

        return (w1 - w2);
    };

    /**
     * 
     * 
     * 
     * @memberOf ActionComponent
     */
    ngOnDestroy() {
        this.actionSub.unsubscribe();
    }

    /**
     * 
     * 
     * @param {any} event 
     * 
     * @memberOf ActionComponent
     */

    public calenderButtonClick(event) {

        if (event.isDoneClicked) {
            this.playerDate = event.date;
            //  this.popupHidden = false;
            this.actionService.PopupHidden = false;

        }
        else {
            // this.popupHidden=false;
            this.actionService.PopupHidden = false;
        }
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf ActionComponent
     */








    private intializeStoreAndView() {
       /* let errorView = new View();
        errorView.id = "noviewitems";
        errorView.name = "no views";
        errorView.shortName = " no view found";*/

        let that = this;
        this.route.data
            .subscribe((dataStore: any) => {
                that.stores = dataStore.data[0];
                if (dataStore.data[1].length == 0) {
                 //   that.views.push(errorView);

                }
                else {
                    console.log("datastore[1]", dataStore.data[1]);
                    that.views = dataStore.data[1];
                }

            });
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf ActionComponent
     */
    private restoreState() {
        let that = this;
        this.route.params.subscribe(params => {
            let id: string = '' + params['id'];
            let type: string = '' + params['type'];
            if (type == null && type == 'undefined') {
                type = 'store';
            }
            if (type == 'store') {
                that.mode = '1';
                if (id != null && id != "undefined") {
                    that.selectedStore = id;
                } else {
                    that.selectedStore = that.stores[0].id;
                }
            } else {
                that.mode = '0';
                if (id != null && id != "undefined") {
                    that.selectedView = id;
                } else {
                    that.selectedView = that.views[0].id;
                }
            }

            if (type == 'store' || type == 'view') {
                // that.title = 'Video';
                if (that.heatmapService.heatmapOn) {
                    that.actionService.pageTitle = 'Heat Maps';
                }
                else {
                    that.actionService.pageTitle = 'Video';
                }
            }

        });
    }

    /**
     * 
     * 
     * @private
     * @param {HTMLInputElement} element 
     * 
     * @memberOf ActionComponent
     */
    private OnRadioClick(element: HTMLInputElement): void {
        var rad = `Radio ${element.value} was selected\n`

        //console.log(rad);
    }

    /**
     * 
     * 
     * @param {string} selectedStore 
     * 
     * @memberOf ActionComponent
     */
    onStoreChange(selectedStore: string) {
        //this.model.power = newVal;
        this.isVideoplayer = false;
        this.actionService.PopupHidden = false;
        this.heatmapService.calendarPopupOn = false;
        this.cookieService.setCookieSelectedStore(selectedStore);
        this.cookieService.setCookieVideoType('store');
        this.videoService.setSelectedVideoSource(null);
        this.router.navigate(['/video/store/' + selectedStore]);
    }

    /**
     * 
     * 
     * @param {any} newVal 
     * 
     * @memberOf ActionComponent
     */
    onViewChange(newVal) {
        this.isVideoplayer = false;
        this.actionService.PopupHidden = false;
        //this.model.power = newVal;
        this.heatmapService.calendarPopupOn = false;
        this.videoService.setSelectedVideoSource(null);
        this.cookieService.setCookieSelectedView(newVal);
        this.cookieService.setCookieVideoType('view');
        this.router.navigate(['/video/view/' + newVal]);
    }

    /**
     * 
     * 
     * 
     * @memberOf ActionComponent
     */
    public onStoreRadioChange() {
        this.isVideoplayer = false;
        this.actionService.PopupHidden = false;
        this.hasStoreSelected = true;
        this.heatmapService.calendarPopupOn = false;
        this.cookieService.setCookieVideoType('store');
        this.videoService.setSelectedVideoSource(null);
        this.selectedView = null;
        this.placeHolderView = 'All Views';
        this.actionBarCommunicationService.action("false");
        this.selectedStore = this.cookieService.getCookieSelectedStore();
        if ((this.stores != undefined)&&(this.stores.length>0)) {
            if (this.selectedStore == null || this.stores.filter(store => store.id == this.selectedStore).length <= 0) {
                this.selectedStore = this.stores[0].id;
            }
        }
        this.router.navigate(['/video/store/' + this.selectedStore]);
    }

    /**
     * 
     * 
     * 
     * @memberOf ActionComponent
     */
    public onViewRadioChange() {
        this.isVideoplayer = false;
        this.actionService.PopupHidden = false;
        this.hasStoreSelected = false;
        this.heatmapService.calendarPopupOn = false;
        this.cookieService.setCookieVideoType('view');
        this.selectedStore = null;
        this.placeHolderStore = 'All Stores';
        this.actionBarCommunicationService.action("false");
        this.selectedView = this.cookieService.getCookieSelectedView();
        this.videoService.setSelectedVideoSource(null);
        if ((this.views != undefined) &&(this.views.length>0)) {
            if (this.selectedView == null || this.views.filter(view => view.id == this.selectedView).length <= 0) {
                this.selectedView = this.views[0].id;
            }
        }
        this.router.navigate(['/video/view/' + this.selectedView]);
    }





    /**
     * 
     * 
     * 
     * @memberOf ActionComponent
     */
    reload() {
        this.router.navigate(['../', { reload: 'reload' }], { relativeTo: this.route });
    }

}
