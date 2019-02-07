import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ApiBuilder {

	public RET_SUCCESS: number = 200;
	private baseURL= "";
	constructor(private http: Http) {
	http.get('./config.json')
                  .map(res => res.json())
                  .subscribe(
                     (data) => {
                       this.baseURL= data.apiurl;
                       console.log('this.baseURL'+ this.baseURL)
                     },
                     err=>console.log(err),
                     ()=>console.log('done')
                   );
	}
	
	
	getAPIBaseURL() {
		return this.baseURL;
	}

  	setAPIBaseURL(url) {
		 this.baseURL = url;
	}

}