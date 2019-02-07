/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { Router , Event as RouterEvent, NavigationStart, NavigationEnd} from '@angular/router';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    
<div class="app-div">
  <router-outlet></router-outlet>  
</div>
  `
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

