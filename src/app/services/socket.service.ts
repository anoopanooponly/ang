import { ApiBuilder } from './api.builder.service';
/*
* Real time private chatting app using Angular 2,Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/


import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/*npm install @types/socket.io-client --save
*/
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

	/* 
	* specifying Base URL.
	*/
	private BASE_URL = 'http://localhost:3000';  
  	private socket;

  	constructor( public api: ApiBuilder) {}

  	/* 
	* Method to connect the users to socket
	*/
  	connectSocket(userId:string){
  		// this.socket = io(this.BASE_URL,{ query: `userId=${userId}`});
		this.socket = io.connect(this.api.getAPIBaseURL() + '/message');
		
  	}
 

	createMangerRoom() {
		this.socket.emit('create room',  { user: 'managersRoom' });
	}

	createWorkerRoom(userId) {
		this.socket.emit('create room',  { user: userId });
	}
 	/* 
	* Method to emit the add-messages event.
	*/
	sendMessage(message:any):void{
		this.socket.emit('new message', message);
	}


    disconnectSocket(data) {
		this.socket.emit('disconnect', data);
		this.socket.disconnect();
	}
	/* 
	* Method to emit the logout event.
	*/
	logout(userId):any{

		this.socket.emit('logout', userId);

		let observable = new Observable(observer => {
			this.socket.on('logout-response', (data) => {
				observer.next(data);    
			});

			return () => {
				
				this.socket.disconnect();
			};  
		})     
		return observable;
	}

	/* 
	* Method to receive add-message-response event.
	*/
	receiveMessages():any{ 
		let observable = new Observable(observer => {
			this.socket.on('webupdatechat', (data) => {
				observer.next(data);    
			});

			return () => {
				this.socket.disconnect();
			};  
		});     
		return observable;
	}

	/* 
	* Method to receive chat-list-response event.
	*/
	getChatList(userId:string):any {

		this.socket.emit('chat-list' , { userId : userId });

		let observable = new Observable(observer => {
			this.socket.on('chat-list-response', (data) => {
				observer.next(data);    
			});

			return () => {
				this.socket.disconnect();
			};  
		})     
		return observable;
	} 

}
