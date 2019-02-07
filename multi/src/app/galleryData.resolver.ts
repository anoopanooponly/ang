import { FilterDataHandler } from './utilities/filter-data-handler';
import { ActionBarCommunicationService } from './services/actionbar.communication.service';
import { CookieService } from './services/cookie.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { VideoService } from './services/video.service';
import { ActionService } from './services/action.service';

/**********************************************************************************
* File Name   :   GalleryDataResolver.ts
* Description :   This resolver class resolves stores/views camera data for the gallery component. 
                  This also do the functionality of routing to correct page by applying filter if any.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

@Injectable()
export class GalleryDataResolver implements Resolve<any> {
  constructor(private actionService: ActionService,
    public videoService: VideoService,
    private router: Router, private cookieService: CookieService,
    private actionBarCommunicationService: ActionBarCommunicationService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];
    let type = route.params['type'];
    
    let videoid = (route.children != null && route.children.length) > 0 ? route.children[0].params['videoid'] : null;
    if (id == null || id == 'undefined') {

      Observable.forkJoin(this.actionService.getStores(), this.actionService.getViews()).subscribe((data) => {
        let stores = data[0];
        let views = data[1];
        
        var storeId = this.cookieService.getCookieSelectedStore();
        var viewId = this.cookieService.getCookieSelectedView();
        var previousVideoType = this.cookieService.getCookieVideoType();
        
        let list = null;
        if (type == null) {
          type = previousVideoType;
          if (type == null || type == 'undefined') {
            type = 'store';
          }
        }
        list = type == 'store' ? stores : views;
        storeId = type == 'store' ? storeId : viewId;
        let foundItemList = list.filter(store => store.id == storeId);
        if (foundItemList == null || foundItemList.length <= 0) {
          storeId =  list.length > 0 ? list[0].id: storeId;
          this.cookieService.setCookieSelectedStore(storeId);
          this.cookieService.setCookieVideoType(type);
        }
        let queryOptional = null;
        let inst = FilterDataHandler.getInstance();
        if (inst != null) {
          queryOptional = (inst.filterQuery != '' ? inst.filterQuery : 'false')
        }
        this.router.navigate(['/video/' + type + '/' + storeId, { filter: (queryOptional != null ? queryOptional : "false") }]);

      });
     

    } else {
      let list: any = type == 'store' ? this.videoService.getStoreCameras(id) : this.videoService.getViewCamaras(id);

      if (list != null && videoid != null && videoid != 'undefined') {
        let that = this;
        //that.actionBarCommunicationService.action("video");
        list.subscribe((cameras) => {
          cameras.filter(camera => camera.id === videoid).map(camera => {
            that.videoService.setSelectedVideoSource(camera);
          })
        });
      }

      return list;
    }
  }
}


