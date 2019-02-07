
/**********************************************************************************
* File Name   :   Routes
* Description :   Defines the routes
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { VideoTabComponent } from './video-tab/components/video-tab/video-tab.component';
import { HlsplayerComponent } from './video-tab/components/hlsplayer/hlsplayer.component';
import { PeopleDataResolver } from './people-count/people-count.resolver';
import { HLResolver } from './highlights/components/highlights-tab/hlresolver';
import { LibPlayerResolver } from './library/components/lib-player/lib-player-resolver';
import { LibraryResolver } from './library/components/library-tab/library-resolver';
import { LibPlayerComponent } from './library/components/lib-player/lib-player.component';
import { LibraryTabComponent } from './library/components/library-tab/library-tab.component';

import { HeatmapLargeComponent } from './heatmap/components/heatmap-large/heatmap-large.component';
import { HeatmapComparisonComponent } from './heatmap/components/heatmap-comparison/heatmap-comparison.component';
import { AuthActivator } from './utilities/auth-activator';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { LoginComponent } from './components/login/login.component';
import { PeopleCountTabComponent } from './people-count/component/people-count-tab/people-count-tab.component';
import { HighlightsTabComponent } from './highlights/components/highlights-tab/highlights-tab.component';

import { ViewsComponent } from './components/views/views.component';
import { ActionComponent } from './components/action/action.component';

import { DataResolver } from './app.resolver';
import { GalleryDataResolver } from './galleryData.resolver';


export const ROUTES: Routes = [

  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    children: [

      { path: 'video', component: VideoTabComponent, canActivate: [AuthActivator], resolve: { data: DataResolver, gallery: GalleryDataResolver } },
      {
        path: 'video/:type/:id',
        component: VideoTabComponent,
        children: [
          {
            path: 'player/:videoid',
            component: HlsplayerComponent,
          },
          {
            path: 'heatmap/:cameraid',
            component: HeatmapComparisonComponent,
          },
          {
            path: 'heatmapcomparisonlarge/:cameraid',
            component: HeatmapLargeComponent,
          },
          {
            path: '', pathMatch: 'full', component: NoContentComponent
          }
        ],
        canActivate: [AuthActivator],
        resolve: { data: DataResolver, gallery: GalleryDataResolver }

      },

      { path: 'video/:type', component: VideoTabComponent, canActivate: [AuthActivator], resolve: { data: DataResolver, gallery: GalleryDataResolver } },
      {
        path: 'library', component: LibraryTabComponent, redirectTo: 'library/ungrouped',
        canActivate: [AuthActivator],
        resolve: { library: LibraryResolver }
      },
      // {
      //   path: 'library/:group/:data', component: LibraryTabComponent,
      //   resolve: { library: LibraryResolver }
      // },
      {
        path: 'library/:group', component: LibraryTabComponent,
        // children: [
        //   {
        //     path: 'player/:cameraId',
        //     component: LibPlayerComponent
        //   },
        //   {
        //     path: '', pathMatch: 'full', component: NoContentComponent
        //   }
        // ],
        resolve: { library: LibraryResolver }
      },
      { path: 'peoplecount/:storeid', component: PeopleCountTabComponent, resolve: {data: PeopleDataResolver}, canActivate: [AuthActivator] },
      { path: 'peoplecount', component: PeopleCountTabComponent, redirectTo: 'peoplecount/all', resolve: {data: PeopleDataResolver}, canActivate: [AuthActivator] },
      
      { path: 'highlights', component: HighlightsTabComponent, resolve: { highlights: HLResolver },canActivate: [AuthActivator] },
      { path: 'highlights/:group', component: HighlightsTabComponent, canActivate: [AuthActivator] },
      { path: '', redirectTo: "/video" }

    ]
  }
];

