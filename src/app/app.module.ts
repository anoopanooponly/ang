import { HttpService } from './services/http.service';
import { SocketService } from './services/socket.service';
import { ChatService } from './services/chat.service';
import { TimeService } from './services/time.service';
import { CompanyService } from './company/company.service';
import { TagInputComponent } from 'angular2-tag-input/lib/components/tag-input/tag-input.component';
import { InputNewComponent } from './job/job/input.component';
import { StorageService } from './services/storage.service';
import { ApiBuilder } from './services/api.builder.service';
import { HttpRequest } from './services/HttpRequest';
import { AuthActivator } from './services/auth.activator';
import { NavbarComponent } from './nav/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

// import ng2-bootstrap alerts module
import { AlertModule } from 'ngx-bootstrap/ng2-bootstrap';
import { RlTagInputModule } from 'angular2-tag-input/lib/tag-input.module';

import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';

import '../styles/styles.scss';
import '../styles/headings.css';
import 'roboto-npm-webfont';
import {LoginComponent} from "./login/login.component";
import {LoginService} from "./services/login.service";

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NoContentComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    XLargeDirective
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
   
    AlertModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ApiBuilder,
    LoginService,
    StorageService,
    CompanyService,
    SocketService,
    HttpService,
    TimeService,
    ChatService,
    AuthActivator,
    {
      provide: HttpRequest,
      useFactory:
        (backend: XHRBackend, defaultOptions: RequestOptions, apiBuilder: ApiBuilder) => {
        return new HttpRequest(backend, defaultOptions, apiBuilder);
      },
      deps: [ XHRBackend, RequestOptions, ApiBuilder]
    }
    
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues  = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
