import { ApiBuilder } from './api.builder.service';
import { StorageService } from './storage.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
/**
 * Created by anoop on 07-06-2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

private loggedInUser;
  constructor(private http: Http, private storageService: StorageService, private apiBuilder: ApiBuilder) {

  }
  
  authenticate(username, password) {
    if ((username == null) || (password == null)) {
      return null;
    }

   
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: headers });
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password); // .toString() => username=abc&password=abc
    return this.http.post(this.apiBuilder.getAPIBaseURL() + '/site/signin', params.toString(), options);
  }

 
   public isLoggedIn() {
        let token: any =  localStorage.getItem('token');
        if (token == null || token === 'undefined') {
            return false;
        }
        return true;
    }
    

     public setLoggedInUser(user){
        this.loggedInUser = user;
    }

   public getLoggedInUser(){
        if(this.loggedInUser != undefined && this.loggedInUser != null){
        return this.loggedInUser;
        } else {
            this.loggedInUser = this.storageService.read('user');
             return this.loggedInUser;
        }
    }

    public logout() {
      this.loggedInUser =null;
      this.storageService.clearAll();
    }

    isManager(){
      return this.loggedInUser.user_type !== 'tasker';
    }

}
