import { AccessPermission } from './../model/access-permission';
/**********************************************************************************
* File Name   :   LoginService.ts
* Description :   This class implements API client interface for Login, which enables 
*                 the Login components to communicate with REST API server 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { StorageService } from './storage.sevice';
import { FilterService } from './filter.service';
import { FilterDataHandler } from './../utilities/filter-data-handler';
import { ActionService } from './action.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs/Observable';
import { AuthData } from './../model/auth-data';
import { ApiBuilder } from './../utilities/api-builder';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class LoginService {
    private authUrl: string;
    private authToken: string;
    private forgotPWUrl: string;
    private logoutUrl: string;
    private TAG = "LOGIN SERVICE :";
    private RET_SUCCESS = 200;

    /**
     * Creates an instance of LoginService.
     * @param {Http} http 
     * @param {ActionService} actionService 
     * @param {FilterService} filterService 
     * @param {StorageService} storageService 
     * 
     * @memberOf LoginService
     */
    constructor(private http: Http, private actionService: ActionService,
        private filterService: FilterService, private storageService: StorageService) {
        var api = ApiBuilder.getInstance();
        this.authUrl = api.getAuthenticationURL();
        if (this.authUrl == null) {
        }
        this.forgotPWUrl = api.getForgotPasswordURL();
        if (this.forgotPWUrl == null) {
        }
        this.logoutUrl = api.getLogoutURL();
        if (this.logoutUrl == null) {
        }
    }

	/**
	* Return Authentication URL 
	* 
	* @param username   : User Name.
	* @param password   : User Password 
	* @return status : true mean pass, false means fail
	*/
    authenticate(username, password) {
        if ((username == null) || (password == null)) {
            return null;
        }
        var body = { "client_name": "webview", "password": "", "username": "", "client_version": "1.91" }
        body.username = username;
        body.password = password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', '*/*');
        var authData = new AuthData();
        return this.http
            .post(this.authUrl, body, { headers: headers })
            .map(response => {
                //console.log('Within map of auth' + response.status);
                if (response.status == this.RET_SUCCESS) {
                    authData.userEmail = response.json().data.email;
                    //  if (authData.userEmail == username) {
                    authData.loginStatus = true;
                    authData.inStoreAccess = response.json().data.in_store_access_only;
                    //   }
                    authData.adminUser = false;
                    let role = response.json().data.role;
                    if (role) {
                        let privilliage = role.privileges;
                        if (privilliage) {

                            if (JSON.stringify(privilliage).indexOf("authenticate:client:web_administration") != -1) {
                                authData.adminUser = true;
                            }
                        }

                    }

                    let accessPermissions = response.json().data.access_permissions;
                    let organizationPermission = Array<AccessPermission>();
                    if (accessPermissions == undefined) {
                        authData.displayOrgList = false;
                        return authData;
                    }
                    for (let i = 0; i < accessPermissions.length; i++) {
                        if (accessPermissions[i].record_type == "organizations") {
                            if (accessPermissions[i].all == true) {

                                authData.superUser = true;
                                authData.displayOrgList = false;

                            } else {
                                let permission = new AccessPermission;
                                permission.id = accessPermissions[i].id;
                                permission.recordId = accessPermissions[i].record_id;
                                permission.recordName = accessPermissions[i].record_name;
                                authData.superUser = false;
                                authData.displayOrgList = true;
                                organizationPermission.push(permission);
                            }
                        }

                    }
                    authData.organization = _.orderBy(organizationPermission, [org => org.recordName.toLowerCase()], ['asc']);
                    this.storageService.write("org", authData.organization);
                }

                return authData;

            }, error => {
                authData.loginStatus = false;
                return authData;
            });
    }

	/**
	* Return Authentication URL 
	* 
	* @param email   : User Name.
	* @param password   : User Password 
	* @return authToken : Authentication Tocken
	*/
    forgotPassword(email) {
        let authData = new AuthData();
        //console.log('ForgotPass service reached..');
        if (email == null) {
            return null;
        }
        // Creating HTTP Request for Login
        var body = { "email": "" };
        body.email = email;
        return this.http
            .post(this.forgotPWUrl, body, null)
            .map(response => {
                let responseStatus = response.status;

                if (responseStatus == this.RET_SUCCESS) {
                    authData.forgotPasswordStatus = true;
                    return authData;
                }
                else {
                    authData.forgotPasswordStatus = false;
                    return authData;
                }
            });
    }
    /**
    * Logout seeion Authentication URL 
    * 
    * @return status 
    */
    logout() {
        let authData = new AuthData();
        authData.logoutStatus = false;
        let headers = new Headers();
        headers.append('Accept', '*/*');
        var that = this;
        FilterDataHandler.getInstance().filterQuery = null;
        this.filterService.clearFilterList();
        this.storageService.clearAll();
        return this.http
            .post(this.logoutUrl, "", { headers: headers })
            .map(response => {
                if (response.status == this.RET_SUCCESS) {
                    authData.logoutStatus = true;
                    that.actionService.clearAll();
                } else {
                    authData.logoutStatus = false;
                    authData.error = "Logout failed. error code" + response.status;
                }
                return authData;

            }, error => {
                //console.log('Authenticatoin Failed' + error);
                authData.logoutStatus = false;
                authData.error = error;
                return authData;
            });
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf LoginService
     */
    isLoggedIn() {
        var isValidUser = Cookie.get('IsValidUser');
        var hasLoggedIn = isValidUser == "Yes" ? true : false;

        return hasLoggedIn;
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf LoginService
     */
    getLocalGateWayIPUrl() {
        let api = ApiBuilder.getInstance();
        let storeUrl = api.getStoreURL();
        let that = this;
        return this.http
            .get(storeUrl, {})
            .map(response => {


                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    let sites = res.data.sites;
                    if (sites == null) {
                        return null;
                    }
                    let gateWaylocalIP;
                    for (let i = 0; i < sites.length; i++) {
                        let gatewayObj = [];
                        gatewayObj = sites[i].gateways;
                        if (gatewayObj != null) {
                            if (gatewayObj.length > 0) {
                                for (let p = 0; i < sites.length; p++) {
                                    gateWaylocalIP = gatewayObj[p].ipv4;
                                    if (gateWaylocalIP !== null) {
                                        return "http://" + gateWaylocalIP + "/hermes/gateway/image?refresh=" + Date.now();
                                    }
                                }
                            }
                        }

                    }
                    return null;
                }

                else {
                    return null;
                }
            }
            )//.subscribe(result => console.log('Subscribe'));
    }

    /**
     * 
     * 
     * @param {string} url 
     * @returns 
     * 
     * @memberOf LoginService
     */
    checkGeorestriction(url: string) {
        let that = this;
        return this.http
            .get(url, {})
            .map(response => {

                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    return true;
                }
                else {
                    return false;
                }
            }
            )//.subscribe(result => console.log('Subscribe'));
    }
    getOrgListForSuperUser() {
        let api = ApiBuilder.getInstance();
        let orgUrl = api.getOrgListUrlForSuperUser();
        let that = this;
        return this.http
            .get(orgUrl, {})
            .map(response => {


                let res = response.json();
                let reponseStatus = response.status;
                if (reponseStatus == this.RET_SUCCESS) {
                    let orgs = res.data.orgs;
                    let organizationPermission = Array<AccessPermission>();
                    let organizationPermissionSorted = Array<AccessPermission>();
                    for (let i = 0; i < orgs.length; i++) {
                        let permission = new AccessPermission;
                        permission.recordId = orgs[i].id;
                        permission.recordName = orgs[i].name;
                        organizationPermission.push(permission);
                        // console.log("SUPER USER ID : " + orgs[i].id);
                        //  console.log("SUPER USER NAME : " + orgs[i].name);
                    }
                    organizationPermissionSorted = _.orderBy(organizationPermission, [org => org.recordName.toLowerCase()], ['asc']);
                    // _.sortBy(users, [function(o) { return o.user; }]);
                    this.storageService.write("org", organizationPermissionSorted);
                    return organizationPermissionSorted;
                }

                else {
                    return null;
                }
            }
            )//.subscribe(result => console.log('Subscribe'));
    }
}


