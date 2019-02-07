import { SocketService } from './../../services/socket.service';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedInUser;
  public isManagerType;

  constructor(private loginService: LoginService, public router: Router, public socketService: SocketService) {
    this.loggedInUser = loginService.getLoggedInUser();
    this.isManagerType = this.loggedInUser.user_type !== 'tasker';
   }

  ngOnInit() {
  
  }

  logout() {
   
    this.router.navigate(['/login']);
    this.exitSocket();
     this.loginService.logout();
  }

  private exitSocket() {
    //going to connect to socket
   let manager = false;
   let id = "";
    if(this.loginService.isManager()) {
      manager = true;
      id = "";
    } else {
      manager = false;
      id = this.loginService.getLoggedInUser().user_id;
    }
    let data = {
       manager: manager,
       id: id
    };
     this.socketService.disconnectSocket(data);
 }
 

 

}
