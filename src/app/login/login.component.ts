import { StorageService } from './../services/storage.service';
import { LoginService } from './../services/login.service';

// import { Cookie } from 'ng2-cookies/ng2-cookies';
// import { LoginService } from './../../services/login.service';
import { Component, OnInit, ViewChild, OpaqueToken } from '@angular/core';
import { Router } from '@angular/router';
// import { MdlDialogComponent, MdlAlertComponent } from 'angular2-mdl/components/dialog/index';
// import { MdlDialogReference, MdlDialogService } from 'angular2-mdl/components/dialog/mdl-dialog.service';
 import { NgForm } from '@angular/forms';
// import { OrgComponent } from './../org/org.component';
// import { StorageService } from './../../services/storage.sevice';
// import { FilterDataHandler } from './../../utilities/filter-data-handler';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService]
})


export class LoginComponent implements OnInit {
    timer:any;
    TEST_VALUE = new OpaqueToken('test value');
    router: Router;
    userName: string;
    userPassword: string;
    loginserv: LoginService;
    showPopup: boolean;
    forgotPwMessage: string;
    submitted = false;
    disableLogin: boolean = false;
    public loggedInUser;
    loginError: string = "Login Error: You must be at your assigned store location.  Contact your administrator";
    // @ViewChild('mdlAlert') private alertDlg: MdlAlertComponent;
    public tags = ['Car', 'Bus', 'Train'];
  public autocompleteTags = [];
  public autocompleteItems = [
    'Banana',
    'Orange',
    'Apple',
    'Pear',
    'Grape',
    'Potato',
    'Peach'
  ];
    heroForm: NgForm;



    constructor(public rout: Router, loginService: LoginService, public storageService: StorageService) {
        this.router = rout;
        this.loginserv = loginService;
        this.disableLogin = false;
    }

    /**
     *
     *
     *
     * @memberOf LoginComponent
     */
    ngOnInit() {
        // if (this.loginserv.isLoggedIn()) {
        //     this.router.navigate(['/']);
        // }
    }

    /**
     * form validation
     *
     * @returns
     *
     * @memberOf LoginComponent
     */
    validateForm() {
     //   if (this.userEmail == null || this.userEmail == 'undefined' || this.userPassword == null || this.userPassword == 'undefined' || !this.ValidateEmail(this.userEmail)) {
           // return false;
       // }
        return true;
    }


clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    /**
     * login
     *
     * @returns
     *
     * @memberOf LoginComponent
     */
    login() {
        this.submitted = true;
        let user = this.userName;
        let image = document.createElement('img');
        let errorMessage = "Network error";
       if (!this.validateForm()) {
            return;
        }
        this.disableLogin = true;
        let that = this;
        this.loginserv
            .authenticate(this.userName, this.userPassword)
            .subscribe(
            authData => {
                console.log("sucess", authData.json());
                let userObj = authData.json();
                 //this.storageService.write("token", userObj.token);
                 localStorage.setItem('token', userObj.token);
                  this.storageService.write("user", userObj);
                  if(userObj.user_type == 'tasker')
                   this.router.navigate(['/message']); 
                   else
                    this.router.navigate(['/']);
            },
            error => {
                   console.log("Error", error);

                this.router.navigate(['/login']);
            }
            );

    }

   

}
