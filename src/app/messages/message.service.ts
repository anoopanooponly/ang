import { HttpRequest } from './../services/HttpRequest';
import { StorageService } from './../services/storage.service';
import { TimeService } from './../services/time.service';
import { Observable } from 'rxjs/Rx';
import { Category } from './../model/Category.model';
import { ApiBuilder } from './../services/api.builder.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
/**
 * Created by anoop on 07-06-2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

constructor(private http: HttpRequest) {
   
  }


  getAllWorkers() {
    let that = this;
    return this.http.get( 'worker')
      .map(response => {
        let list = new Array<any>();
        let res = response.json();
        let rsponseStatus = response.status;
        list.push(...res);
        return list;
      });
  }

  getLastMessagesWithCount(loggedInuserId, toUserId, userType) {
 let that = this;
 
    let query = '?userId=' + loggedInuserId;
 
 if(toUserId != null) {
  query += '&taskerId=' + toUserId;
 }
 
query += '&currentusertype=' + userType;
    return this.http.get( 'lastmessage' + query, {
   
 } )
      .map(response => {
        let list = new Array<any>();
        let res = response.json();
        let rsponseStatus = response.status;
        list.push(...res.messages);

        list.map(message => {

          if(message.user.length > 0 && message.tasker.length ) {
             if(message.to == message.user[0]._id) {
              message.toname = message.user[0].username;
          } else if(message.to == message.tasker[0]._id) {
                message.toname = message.tasker[0].username;
          }
           if(message.from == message.user[0]._id) {
              message.fromname = message.user[0].username;
          } else if(message.from == message.tasker[0]._id) {
                message.fromname = message.tasker[0].username;
          }
          delete message['user'];
           delete message['tasker'];
          }
          
        })
        return list;
      });
  }
  
  getAllMessage(loggedInuserId, toUserId, userType) {
    let that = this;
    let params: URLSearchParams = new URLSearchParams();
    let query = '?userId=' + loggedInuserId;
  params.set('userId', loggedInuserId);
 if(toUserId != null) {
  params.set('taskerId', toUserId);
  query += '&taskerId=' + toUserId;
 }
 params.set('currentusertype', userType);
query += '&currentusertype=' + userType;
    return this.http.get( 'message' + query, {
   params: params
 } )
      .map(response => {
        let list = new Array<any>();
        let res = response.json();
        let rsponseStatus = response.status;
        list.push(...res.messages);

        list.map(message => {

          if(message.user.length > 0 && message.tasker.length ) {
             if(message.to == message.user[0]._id) {
              message.toname = message.user[0].username;
          } else if(message.to == message.tasker[0]._id) {
                message.toname = message.tasker[0].username;
          }
           if(message.from == message.user[0]._id) {
              message.fromname = message.user[0].username;
          } else if(message.from == message.tasker[0]._id) {
                message.fromname = message.tasker[0].username;
          }
          delete message['user'];
           delete message['tasker'];
          }
          
        })
        return list;
      });
  }
}