/*
* Real time private chatting app using Angular 2,Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/


import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {

  	/* 
	* specifying Base URL.
	*/
    private BASE_URL = 'http://localhost:4000/';

    /* 
	* Setting the Request headers.
	*/
    private headerOptions = new RequestOptions({
        headers : new Headers({ 'Content-Type' : 'application/json;charset=UTF-8' })
    });

  	constructor( private http:Http) { }

  	public userNameCheck(params){
  		return this.http.post(`${this.BASE_URL}usernameCheck`,JSON.stringify(params),this.headerOptions)
  			.map( (response:Response) => response.json())
  			.catch( (error:any) => Observable.throw(error.json().error || `Server error`) );
  	}

	public login(params){
        return this.http.post(`${this.BASE_URL}login`,JSON.stringify(params),this.headerOptions)
  			.map( (response:Response) => response.json())
  			.catch( (error:any) => Observable.throw(error.json().error || `Server error`) );
  	}

  	public registerUser(params){
  		return this.http.post(`${this.BASE_URL}registerUser`,JSON.stringify(params),this.headerOptions)
  			.map( (response:Response) => response.json())
  			.catch( (error:any) => Observable.throw(error.json().error || `Server error`) );
  	}

    public userSessionCheck(params){
        return this.http.post(`${this.BASE_URL}userSessionCheck`,JSON.stringify(params),this.headerOptions)
            .map( (response:Response) => response.json())
            .catch( (error:any) => Observable.throw(error.json().error || `Server error`) );
    }

	public getMessages(params){
		return this.http.post(`${this.BASE_URL}getMessages`,JSON.stringify(params),this.headerOptions)
	    	.map( (response:Response) => response.json())
	      	.catch( (error:any) => Observable.throw(error.json().error || `Server error`) );
	}
}
