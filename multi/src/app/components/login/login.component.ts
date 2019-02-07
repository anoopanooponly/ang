
/**********************************************************************************
* File Name   :   LoginComponent.ts
* Description :   Login functionalites are implemented in this class
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LoginService } from './../../services/login.service';
import { Component, OnInit, ViewChild, OpaqueToken } from '@angular/core';
import { Router } from '@angular/router';
import { MdlDialogComponent, MdlAlertComponent } from 'angular2-mdl/components/dialog/index';
import { MdlDialogReference, MdlDialogService } from 'angular2-mdl/components/dialog/mdl-dialog.service';
import { NgForm } from '@angular/forms';
import { OrgComponent } from './../org/org.component';
import { StorageService } from './../../services/storage.sevice';
import { FilterDataHandler } from './../../utilities/filter-data-handler';

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
    userEmail: string;
    userPassword: string;
    loginserv: LoginService;
    showPopup: boolean;
    forgotPwMessage: string;
    submitted = false;
    disableLogin: boolean = false;
    loginError: string = "Login Error: You must be at your assigned store location.  Contact your administrator";
    @ViewChild('mdlAlert') private alertDlg: MdlAlertComponent;

    heroForm: NgForm;
    @ViewChild('heroForm') currentForm: NgForm;

    /**
     * Creates an instance of LoginComponent.
     * @param {Router} rout 
     * @param {LoginService} loginService 
     * @param {MdlDialogService} dialogService 
     * 
     * @memberOf LoginComponent
     */
    constructor(public rout: Router, loginService: LoginService, public dialogService: MdlDialogService,public storageService :StorageService) {
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
        if (Cookie.get('IsValidUser') == "Yes") {
            this.router.navigate(['/']);
        }
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
        let user = this.userEmail;
        let image = document.createElement('img');
        let errorMessage = "Network error";
       if (!this.validateForm()) {
            return;
        }
        this.disableLogin = true;
        let that = this;
        this.loginserv
            .authenticate(this.userEmail, this.userPassword)
            .subscribe(
            authData => {
              if (authData.loginStatus) {
                    if (authData.inStoreAccess) {

                        this.loginserv.getLocalGateWayIPUrl().
                            subscribe((url) => {

                                image.src = url;
                                this.timer = setTimeout(function (theImg) {
                                    return function () {
                                        that.disableLogin=false;
                                        that.dialogService.alert(that.loginError);
                                    };
                                } (image), 3000);

                                image.onload = function () {
                                    that.clearTimer();
                                    that.allowUserAccees(authData);
                                };

                                image.onerror = function () {
                                 //   that.dialogService.alert(that.loginError);
                                }
                            });
                    }else{
                        if (authData.superUser){

                            this.loginserv.getOrgListForSuperUser().
                            subscribe((orgList)=>{
                                authData.displayOrgList =true;
                                authData.organization =orgList;
                                 that.allowUserAccees(authData);
                            
                            });

                        }else{
                        that.allowUserAccees(authData);
                        }
                    }
                }
                else {
                    this.disableLogin=false;
                    Cookie.set('IsValidUser', "No");
                    Cookie.set('UserEmail', null);
                   errorMessage= "Invalid email or password.<br/> You have entered '" + this.userEmail + "'";  
                    this.dialogService.alert(errorMessage);
                    this.router.navigate(['/login']);
                }

            },
            error => {
                  that.disableLogin = false;
                //this.errorMessage = <any>error
                if(error.status==401){
                 errorMessage = "Invalid email or password.<br/> You have entered '" + this.userEmail + "'";  
               }
                console.error("Login Error:", error);
                that.disableLogin = false;
                this.dialogService.alert(errorMessage);
                this.router.navigate(['/login']);
            }
            );

    }

    /**
     * show organization dialog
     * 
     * 
     * @memberOf LoginComponent
     */
    showOrganizationDilaog() {
        let pDialog = this.dialogService.showCustomDialog({
            component: OrgComponent,
            providers: [{ provide: this.TEST_VALUE, useValue: 'Just an example' }],
            isModal: true,
            styles: { 'width': '350px','overflow':'auto' },
            clickOutsideToClose:false,
            enterTransitionDuration: 400,
            leaveTransitionDuration: 400
        });
        pDialog.subscribe((dialogReference: MdlDialogReference) => {
            // console.log('dialog visible', dialogReference);
        });
    }

    /**
     * forgot password
     * 
     * @param {string} userEmail 
     * 
     * @memberOf LoginComponent
     */
    ForgotPassword(userEmail: string) {
        let errorMessage;
        let invalidEmail = "'" + userEmail + "' is an invalid email id";
        if ((userEmail = undefined) || (userEmail = null)) {
            errorMessage = "Please enter Email Id.";
        } else {
            errorMessage = "Please enter a valid Email Id.<br/> You have entered '" + userEmail + "'.";
        }
        if (this.ValidateEmail(this.userEmail)) {
            //this.forgotPwMessage = "An email containing password reset instructions will be send to your mail id";
            var that = this;
            this.loginserv.forgotPassword(this.userEmail)
                .subscribe(authData => {
                    if (authData.forgotPasswordStatus == false) {
                        that.dialogService.alert(invalidEmail);
                    }
                    else {
                        // console.log('forgot password call succeeded.');
                    }
                },
                error => {
                    that.dialogService.alert(invalidEmail);
                }
                );
        }
        else {
            this.forgotPwMessage = errorMessage;
        }

    }

    /**
     * email validation
     * 
     * @private
     * @param {any} email 
     * @returns 
     * 
     * @memberOf LoginComponent
     */
    private ValidateEmail(email) {

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * dialog
     * 
     * 
     * @memberOf LoginComponent
     */
    public onDialogShow() {
        let errorMessage;
        if ((this.userEmail == 'undefined') || (this.userEmail == null) || (this.userEmail == "")) {
            errorMessage = "Please enter Email Id."
        } else {
            errorMessage = "Please enter a valid Email Id.<br/> You have entered '" + this.userEmail + "'.";
        }

        if (this.ValidateEmail(this.userEmail)) {
            let pDialog = this.dialogService.showDialog({
                title: 'Password reset',
                message: 'An email containing password reset instructions will be sent to your mail id.',
                isModal: true,
                actions: [
                    {
                        handler: () => {
                            // console.log('forgot password  dialog called');
                            this.ForgotPassword(this.userEmail);
                        },
                        text: 'Ok'
                    },
                    {
                        handler: () => {

                        },
                        text: 'Cancel',
                        isClosingAction: true
                    }
                ],
                fullWidthAction: false,

                styles: { 'width': '350px' }
            });
        } else {
            this.dialogService.alert(errorMessage);
        }
    }


    /**
     * 
     * 
     * 
     * @memberOf LoginComponent
     */
    public onDialogHide() {

    }

    /**
     * 
     * 
     * 
     * @memberOf LoginComponent
     */
    public sendMail() {
        // console.log('sendMail');
    }

    /**
     * allow user access
     * 
     * @param {*} authData 
     * 
     * @memberOf LoginComponent
     */
    allowUserAccees(authData: any) {
        Cookie.set('UserEmail', authData.userEmail);
        Cookie.set('adminUser', authData.adminUser ? 'On' : 'Off');
        if(authData.superUser){
          //  FilterDataHandler.getInstance().setOrganization('-1');
             this.showOrganizationDilaog();
        }
        else{
            if (authData.organization.length == 1) {
                console.log("inside 1 org condition");
                let orgList = this.storageService.read("org");

                Cookie.set('IsValidUser', "Yes");
                if (orgList[0].recordId !== '-1') {
                    FilterDataHandler.getInstance().setOrganization(orgList[0].recordId);
                }
                this.rout.navigate(['/video/store']);
            }
            else {
                if (authData.displayOrgList && (authData.organization.length > 1 || !authData.superUser)) {
                    this.showOrganizationDilaog();
                } else {
                    this.router.navigate(['/video/store']);
                }
            }
        }
        //this.router.navigate(['/video/store']);
       
        
    }

}
