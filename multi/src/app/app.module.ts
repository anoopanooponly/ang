import { PeopleCountingService } from './services/people-counting.service';
import { StorageService } from './services/storage.sevice';
import { FilterService } from './services/filter.service';
import { AppState, InternalStateType } from './app.service';
import { TimeService } from './services/time.service';
import { CookieService } from './services/cookie.service';
import { ActionBarCommunicationService } from './services/actionbar.communication.service';
import { LoginService } from './services/login.service';
import { ActionService } from './services/action.service';
import { VideoService } from './services/video.service';
import { PlayerService } from './services/player.service';
import { HeatmapService } from './services/heatmap.service';
import { LibraryService } from './services/library.service';
import { HighlightsService } from './services/highlights.service';

import { AuthActivator } from './utilities/auth-activator';
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { DISABLE_NATIVE_VALIDITY_CHECKING } from 'angular2-mdl';
import { MdCardModule } from '@angular/material/card';
import { MdProgressBarModule } from '@angular/material/progress-bar';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component

import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { NoContentComponent } from './no-content';
// import { XLarge } from './home/x-large';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { GalleryComponent } from './video-tab/components/gallery/gallery.component';
import { ImageLoader } from './video-tab/components/gallery/image.component';
import { HlsplayerComponent } from './video-tab/components/hlsplayer/hlsplayer.component';
import { VideoTabComponent } from './video-tab/components/video-tab/video-tab.component';
import { CreateClipComponent } from './video-tab/components/create-clip/create-clip.component';
import { ViewsComponent } from './video-tab/components/views/views.component';
import { ActionComponent } from './video-tab/components/action/action.component';
import { PlayerCalendarComponent } from './video-tab/components/player-calendar/player-calendar.component';
import { GalleryDataResolver } from './galleryData.resolver';

import { HeatmapComponent } from './heatmap/components/heatmap/heatmap.component';
import { HeatmapCalendarComponent } from './heatmap/components/heatmap-calendar/heatmap-calendar.component';
import { HeatmapComparisonComponent } from './heatmap/components/heatmap-comparison/heatmap-comparison.component';
import { HeatmapLargeComponent } from './heatmap/components/heatmap-large/heatmap-large.component';

import { LibraryResolver } from './library/components/library-tab/library-resolver';
import { LibraryTabComponent } from './library/components/library-tab/library-tab.component';
import { LibActionComponent } from './library/components/lib-action/lib-action.component';
import { LibDownloadComponent } from './library/components/lib-download/lib-download.component';
import { LibStoreComponent } from './library/components/lib-store/lib-store.component';
import { LibStoreListComponent } from './library/components/lib-store-list/lib-store-list.component';
import { LibUngroupedComponent } from './library/components/lib-ungrouped/lib-ungrouped.component';
import { LibSeeMoreComponent } from './library/components/lib-see-more/lib-see-more.component';
import { LibCliptimeListComponent } from './library/components/lib-cliptime-list/lib-cliptime-list.component';
import { LibCliptimeComponent } from './library/components/lib-cliptime/lib-cliptime.component';
import { LibImageComponent } from './library/components/lib-image/lib-image.component';
import { LibSeemoreDatewiseComponent } from './library/components/lib-seemore-datewise/lib-seemore-datewise.component';

import { HlActionComponent } from './highlights/components/hl-action/hl-action.component';
import { HlStoreListComponent } from './highlights/components/hl-store-list/hl-store-list.component';
import { HlStoreComponent } from './highlights/components/hl-store/hl-store.component';
import { HlSeeMoreComponent } from './highlights/components/hl-see-more/hl-see-more.component';
import { HlCliptimeListComponent } from './highlights/components/hl-cliptime-list/hl-cliptime-list.component';
import { HlCliptimeComponent } from './highlights/components/hl-cliptime/hl-cliptime.component';
import { HlReelListComponent } from './highlights/components/hl-reel-list/hl-reel-list.component';
import { HlReelComponent } from './highlights/components/hl-reel/hl-reel.component';
import { HighlightsTabComponent } from './highlights/components/highlights-tab/highlights-tab.component';
import { HlUngroupedComponent } from './highlights/components/hl-ungrouped/hl-ungrouped.component';
import { HLResolver } from './highlights/components/highlights-tab/hlresolver';

import { LoginComponent } from './components/login/login.component';
import { PeopleActionComponent } from './people-count/component/people-action/people-action.component';
import { PEOPLE_RESOLVER_PROVIDERS } from './people-count/people-count.resolver'; 
import { PeopleCountTabComponent } from './people-count/component/people-count-tab/people-count-tab.component';
import { FilterComponent } from './components/filter/filter.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { OrgComponent } from './components/org/org.component';
import { HlDownloadComponent } from './highlights/components/hl-download/hl-download.component';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  GalleryDataResolver,
  PEOPLE_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};


export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'swipe': {velocity: 0.4, threshold: 20}, // override default settings
      'pan':{velocity: 0.4, threshold: 10}
  }
}
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    NoContentComponent,
    // XLarge,

    GalleryComponent,
    ImageLoader,
    HlsplayerComponent,
    LoginComponent,
    VideoTabComponent,
    PeopleCountTabComponent,
    LibraryTabComponent,
    HighlightsTabComponent,

    ViewsComponent,
    ActionComponent,
    HeatmapComponent,
    HeatmapCalendarComponent,
    HeatmapComparisonComponent,
    PlayerCalendarComponent,
    LibActionComponent,
    LibDownloadComponent,

    HeatmapLargeComponent,
    LibStoreComponent,
    LibStoreListComponent,
    LibUngroupedComponent,
    LibSeeMoreComponent,
    PeopleActionComponent,
    CreateClipComponent,
    LibCliptimeListComponent,
    LibCliptimeComponent,
    LibImageComponent,
    LibSeemoreDatewiseComponent,
    FilterComponent,
    HlActionComponent,
    HlStoreListComponent,
    HlStoreComponent,
    HlSeeMoreComponent,
    HlCliptimeListComponent,
    HlCliptimeComponent,
    HlReelListComponent,
    HlReelComponent,
    HlUngroupedComponent,
    SettingsComponent,
    OrgComponent,
    HlDownloadComponent,

  ],
  entryComponents: [OrgComponent],
  imports: [ // import Angular's modules
    BrowserModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MdlModule,
    MdlSelectModule,
    MdCardModule,
    MdProgressBarModule,
    MyDateRangePickerModule,
   
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ActionService,
    LibraryService,
    LibraryResolver,
    LoginService,
    ActionBarCommunicationService,
    VideoService,
    AuthActivator,
    CookieService,
    HeatmapService,
    TimeService,
    PlayerService,
    LibraryService,
    FilterService,
    HighlightsService,
    StorageService,
    PeopleCountingService,
    HLResolver,
    { provide: DISABLE_NATIVE_VALIDITY_CHECKING, useValue: true },
    { 
                    provide: HAMMER_GESTURE_CONFIG, 
                    useClass: MyHammerConfig 
                }
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) { }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

