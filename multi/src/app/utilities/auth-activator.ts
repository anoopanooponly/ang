/**********************************************************************************
* File Name   :   AuthActivator.ts
* Description :   This class implements AuthActivator
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 10-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { LoginService } from './../services/login.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { FilterDataHandler } from './../utilities/filter-data-handler';
@Injectable()
export class AuthActivator implements CanActivate {


  /**
   * Creates an instance of AuthActivator.
   * @param {LoginService} loginService 
   * @param {Router} router 
   * 
   * @memberOf AuthActivator
   */
  constructor(private loginService: LoginService, private router: Router) { }


  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf AuthActivator
   */
  canActivate() {

    if (this.loginService.isLoggedIn()) {
       let selcetedOrg = Cookie.get('SelectedOrgId')
        if (selcetedOrg !=undefined ){

             FilterDataHandler.getInstance().setOrganization(selcetedOrg);
         } 
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
