import { ApiBuilder } from './api.builder.service';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { LoginService } from './../services/login.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthActivator implements CanActivate {

constructor(private loginService: LoginService,private router: Router, private apiBuilder: ApiBuilder, private http: Http) {}

  canActivate() {
    if(this.apiBuilder.getAPIBaseURL() != null && this.apiBuilder.getAPIBaseURL() != "" && this.apiBuilder.getAPIBaseURL() !== 'undefined') {
        return Observable.of(this.isLoggedIn());
    } else {
       return this.loadBaseURL();
    }
       
   }


      private loadBaseURL() {
            return this.http.get('./config.json')
                  .map(res => res.json())
                  .map(
                     (data) => {
                       this.apiBuilder.setAPIBaseURL(data.apiurl);
                       console.log('this.baseURL'+ data.apiurl);
                       return this.isLoggedIn();
                     },
                     err=> {
                       console.log(err);
                        return false;
                     }
                   );
      }

      private isLoggedIn() {
         if (this.loginService.isLoggedIn()) {
                      return true;
          }
          this.router.navigate(['login']);
          return false;
      }

}
