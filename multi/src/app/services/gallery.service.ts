
///Dummy Class Need to be removed 
import { Camera } from './../model/camera';
import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FakecameraService } from './fakecamera.service';

//import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GalleryService {
	private url: string;
	private authUrl: string;
	public cameras;
	public authToken;
	private authCookie: string;
	private fakeCam: FakecameraService;
	//private dataObserver: Observer;

	/**
	 * Creates an instance of GalleryService.
	 * @param {Http} http 
	 * 
	 * @memberOf GalleryService
	 */
	constructor(private http: Http) {
	}

	/**
	 * 
	 * 
	 * @param {any} cameraList 
	 * 
	 * @memberOf GalleryService
	 */
	setCameras(cameraList) {
		this.cameras = cameraList;

	}

	/**
	 * 
	 * 
	 * @param {any} cameraId 
	 * 
	 * @memberOf GalleryService
	 */
	getCameras(cameraId) {
		this.cameras = this.fakeCam.GetFakeCams().data.devices;
	}

	/**
	 * 
	 * 
	 * @param {any} username 
	 * @param {any} password 
	 * 
	 * @memberOf GalleryService
	 */
	authenticate(username, password) {
		var body = 'username=${username}&password=${password}&client_name=webview&client_version=1.9.2';
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', '*/*');
		this.http
			.post(this.authUrl, body, { headers: headers })
			.map((response: Response) => {
				var token = response.json();
				this.authToken = token;
			})
			.subscribe(result => {
				//this.dataObserver.next(result);
			}, error => console.log('Authenticatoin Failed' + error));
		setTimeout(() => { }, 10000);
	}


}
