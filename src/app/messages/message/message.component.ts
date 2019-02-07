import { TimeService } from './../../services/time.service';
import { MessageService } from './../message.service';
import { LoginService } from './../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './../../services/socket.service';
import { ChatService } from './../../services/chat.service';
import { StorageService } from './../../services/storage.service';
import { Company } from './../../model/company.model';
import { CompanyService } from './../../company/company.service';
import { Category } from './../../model/Category.model';
import { Component, OnInit, ViewChild, DoCheck, Input, SimpleChanges} from '@angular/core';
import {JobService} from "../job.service";
import {TagInputComponent} from 'angular2-tag-input';
import { ModalDirective } from 'ngx-bootstrap';
import _ from "lodash";

@Component({
  selector: 'messages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],

})
export class MessageComponent  {  

	
	/*
	* UI related variables starts
	*/
	private overlayDisplay = false;
	private selectedUserId = null;
	private selectedSocketId = null;
	private selectedUserName = null;	
	/* 
	* UI related variables ends
	*/

	/*
	* Chat and message related variables starts
	*/
	private username = null;
	private userId = null;
	private socketId = null;
	private chatListUsers = [];
	private message = '';
	private messages = [];
  private fromUserId;
  private fromUserType;
  private messageUsers = [];
	/*
	* Chat and message related variables ends
	*/


	constructor( 
    	private chatService : ChatService,
		private socketService : SocketService,
		private route :ActivatedRoute,
		private router :Router,
        private loginService: LoginService,
		private messageService: MessageService,
		private timeService: TimeService
	) { 
    this.fromUserId = loginService.getLoggedInUser().user_id;
    this.fromUserType = loginService.getLoggedInUser().user_type;

	if(this.fromUserType !== 'tasker') {
			 messageService.getAllWorkers().subscribe(workers => {
				 this.messageUsers = workers;		
				 this.messageUsers.map(worker => {
					 worker.messages = [];
					 		 this.messageService.getLastMessagesWithCount( null, worker._id, this.fromUserType).subscribe(messages => {
        messages.map(message => {
			if(message.user_status != null && message.user_status.length > 0 ) 
			{
				worker.messageCount  = message.user_status.filter(status => status == 1).length;
				
			}
		})
	  });
				 });	
					console.log("workers", this.messageUsers);
			});
			
	} else {
		 this.messageService.getLastMessagesWithCount( this.fromUserId, null,this.fromUserType).subscribe(messages => {
        messages.map(message => {
			if(message.toManger) {
				let user = {_id :message.to, username: message.toname, messageCount: message.count, messages: [], selected: false, type: message.type, createdAt: message.createdAt};
				if(this.messageUsers.indexOf(user) == -1)
				this.messageUsers.push(user);
				user.messageCount  = message.tasker_status.filter(status => status == 1).length;
			} else {
				let user = {_id :message.from, username: message.fromname, messageCount: message.count, messages: [], selected: false, type: message.type, createdAt: message.createdAt};
				if(this.messageUsers.indexOf(user) == -1)
				this.messageUsers.push(user);
				user.messageCount  = message.tasker_status.filter(status => status == 1).length;
			}
		})
	  });
	}
	
  }

	ngOnInit() {
         // this.selectedUserId = "58ac5f3eb0e24b7ceb1e63c2";
          //this.chatListUsers.push("58ac5f3eb0e24b7ceb1e63c2");
		  let that = this;
		    	this.socketService.receiveMessages().subscribe((response:any) => {
					if(response.from != null && response.from != that.fromUserId) {
						let foundusers = that.messageUsers.filter(user => user._id == response.from);
						if(foundusers.length<= 0){
							let user = {_id :response.from, username: response.fromname, messageCount: 1, messages: [response], selected: false,
								 type: response.type, createdAt: this.timeService.getFormattedTime(response.createdAt)};
							if(user.type == 'user' && response.to == that.fromUserId) {
                             that.messageUsers.push(user);
							
							 if(that.selectedUserId == null)
								{
									that.selectedUserId = user._id;
									that.selectedUserName = user.username;
									user.selected = true;
								}
								// else {
								// 	foundusers[0].messageCount++;
								// 	foundusers[0].messages.push(response);
								// }
							} else { // other managers message
								let foundusers = that.messageUsers.filter(user => user._id == response.to);
								 if(that.selectedUserId == null) {
								that.selectedUserId = foundusers[0]._id;
								that.selectedUserName = foundusers[0].username;
								foundusers[0].selected = true;
								 } else {
									 if(foundusers[0]._id !== that.selectedUserId) {
									foundusers[0].messageCount++;
										}
									foundusers[0].messages.push(response);
								 }
							}
						} else {
									 response.createdAt = this.timeService.getFormattedTime(response.createdAt);
									if(foundusers[0] != null){
										if(foundusers[0]._id !== that.selectedUserId) {
									foundusers[0].messageCount++;
										}
									foundusers[0].messages.push(response);
									}
								 }
						
					}
			    		if((that.selectedUserId && that.selectedUserId == response.from) ||
						 (response.type == 'user' && response.type == that.fromUserType && response.from !== that.fromUserId) ) {
							
			    			that.messages.push(response);
							
			    			setTimeout( () =>{
			    					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
			    			},100);
			    		}
			    	});
		/*
		* getting userID from URL using 'route.snapshot'
		*/		
		// this.userId = this.route.snapshot.params['userid'];

		// if(this.userId === '' || typeof this.userId == 'undefined') {
		// 	this.router.navigate(['/']);
		// }else{

		// 	/*
		// 	* function to check if user is logged in or not starts
		// 	*/	
		// 	this.chatService.userSessionCheck(this.userId,( error, response )=>{
	  //   		if(error) {
	  //   			this.router.navigate(['/']); /* Home page redirection */
	  //   		}else{
	    			
	  //   			this.username = response.username;
	  //     			this.overlayDisplay = true;

	  //     			/*
		// 			* making socket connection by passing UserId.
		// 			*/	
		// 			this.socketService.connectSocket(this.userId);

		// 			/*
		// 			* calling method of service to get the chat list.
		// 			*/	
		// 			this.socketService.getChatList(this.userId).subscribe(response => {
	      				
	  //     				if(!response.error) {
	      					
	  //     					if(response.singleUser) {

	  //     						/* 
	  //     						* Removing duplicate user from chat list array.
	  //     						*/
	  //     						if(this.chatListUsers.length > 0) {
	  //     							this.chatListUsers = this.chatListUsers.filter(function( obj ) {
		// 								return obj._id !== response.chatList._id;
		// 							});
	  //     						}

	  //     						/* 
	  //     						* Adding new online user into chat list array
	  //     						*/
	  //     						this.chatListUsers.push(response.chatList);

	  //     					}else if(response.userDisconnected){
	  //     						this.chatListUsers = this.chatListUsers.filter(function( obj ) {
		// 							return obj.socketId !== response.socketId;
		// 						});
	  //     					}else{
	  //     						/* 
	  //     						* Updating entire chatlist if user logs in.
	  //     						*/
	  //     						this.chatListUsers = response.chatList;
	  //     					}
	  //     				}else{
	  //     					alert(`Chat list failure.`);
	  //     				}
		// 	    	});


		// 			/* 
		// 			* subscribing for messages statrts
		// 			*/
		// 	    	this.socketService.receiveMessages().subscribe(response => {
		// 	    		if(this.selectedUserId && this.selectedUserId == response.fromUserId) {
		// 	    			this.messages.push(response);
		// 	    			setTimeout( () =>{
		// 	    					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
		// 	    			},100);
		// 	    		}
		// 	    	});
		// 	    	/* 
		// 			* subscribing for messages statrts
		// 			*/
			    	
	  //   		}
	  //   	});
		// }
	}

	/* 
	* Method to select the user from the Chat list starts
	*/
	selectedUser(user):void{
		this.selectedUserId = user._id;
		this.selectedSocketId = user.socketId;
		this.selectedUserName = user.username;
		this.messages = [];

		
		this.messageUsers.map(user => {
			user.selected = false;
		
		})
		user.selected = true;
		let selectedUser = this.messageUsers.filter(user => {
			return user.selected;
		
		})
		//if(!user.messageLoaded) {
			 selectedUser[0].messages = [];
		this.loadMessages(selectedUser[0], this.selectedUserId);
		//user.messageLoaded = true;
	//} else {
    // if(selectedUser != null && selectedUser.length > 0 && selectedUser[0].messages.length > 0)
	//	selectedUser[0].messages.map(message => {
		//		this.messages.push(message);
		//})
	//}
	
		


		
		
    //    this.messageService.getAllMessage().subscribe(messages => {

	//    })
		/* 
		* calling method to get the messages
		*/
		// this.chatService.getMessages({ userId : this.userId,toUserId :user._id} , ( error , response)=>{
		// 	if(!response.error) {
		// 		this.messages = response.messages;
		// 	}
		// });
	}

	loadMessages(selectedUser, selectedUserId = null) {
      
	  this.messageService.getAllMessage( this.fromUserId, selectedUserId,this.fromUserType).subscribe(messages => {
         console.log("messages: ", messages);
		 selectedUser.messages.push(...messages);
		selectedUser.messages.map(message => {
			    let date =  this.timeService.getFormattedTime(message.createdAt); 
				message.createdAt = date;
				
				this.messages.push(message);
		});
		selectedUser.messageCount = 0;
	  });
	}

	isUserSelected(userId:string):boolean{
		if(!this.selectedUserId) {
			return false;
		}
		return this.selectedUserId ===  userId ? true : false;
	}

	sendMessage(event){ 
		if(event.keyCode === 13) {
			if(this.message === '' || this.message === null) {
				alert(`Message can't be empty.`);
			}else{

				if (this.message === '') {
					alert(`Message can't be empty.`);
				}else if(this.userId === ''){
					this.router.navigate(['/']);					
				}else if(this.selectedUserId === ''){
					alert(`Select a user to chat.`);
				}else{

					// const data = {
					// 	fromUserId : this.userId,
					// 	message : (this.message).trim(),
					// 	toUserId : this.selectedUserId,
					// 	toSocketId : this.selectedSocketId,
					// 	fromSocketId : this.socketId
					// }
					// this.messages.push(data);
					
					
					/* 
					* calling method to send the messages
					*/
				let toManager = false;	
				if(this.fromUserType == 'tasker') {
					toManager = true;
				}
                
				let tasker = "";
				let user = "";
				if(this.fromUserType == 'tasker') {
					tasker = this.fromUserId;
					user = this.selectedUserId;
				} else {
					tasker = this.selectedUserId;
					user = this.fromUserId;
				}
				let date =  this.timeService.getFormattedTime();
           let dataToSend = { 
            'message': this.message, 'to': this.selectedUserId, 'from':  this.fromUserId, type: this.fromUserType, 
			'fromname': this.loginService.getLoggedInUser().user, toManger: toManager, 'tasker': tasker, 'user': user, createdAt:date  };
			
			this.socketService.sendMessage(dataToSend);

			let selectedUser = this.messageUsers.filter(user => {
			return user.selected;
		
	    	})	
			selectedUser[0].messages.push(dataToSend);
			this.messages.push(dataToSend);
          	this.message = null;
			  setTimeout( () =>{
	    					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
	    			},100);
				}
			}
		}
	}

	alignMessage(userId){
		return this.fromUserId ===  userId ? true :false ;
	}


  
}
