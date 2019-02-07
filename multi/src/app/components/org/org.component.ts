
/**********************************************************************************
* File Name   :   HomeComponent.ts
* Description :   This angular component represents the main view once logged in. 
                  The template for this component renders menu bar, sidebar, progress bar and
                  a main area ,which is the place holder for all other components.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { StorageService } from './../../services/storage.sevice';
import { FilterDataHandler } from './../../utilities/filter-data-handler';
import { AccessPermission } from './../../model/access-permission';
import { LoginService } from './../../services/login.service';
import { Router } from '@angular/router';
import { MdlDialogReference } from 'angular2-mdl/components/dialog/mdl-dialog.service';
import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})

//export const TEST_VALUE = new OpaqueToken('test value');
export class OrgComponent  {
   
   private orgList: any;

   /**
    * Creates an instance of OrgComponent.
    * @param {MdlDialogReference} dialog 
    * @param {Router} rout 
    * @param {StorageService} storageService 
    * 
    * @memberOf OrgComponent
    */
   constructor(private dialog: MdlDialogReference, public rout: Router, private storageService: StorageService) {
      this.orgList = this.storageService.read("org");
      // register a listener if you want to be informed if the dialog is closed.
      this.dialog.onHide().subscribe( (user) => {
        if (user) {
          // console.log('authenticated user', user);
        }
      });
    }


    /**
     * show org dialog
     * 
     * @param {any} orgId 
     * 
     * @memberOf OrgComponent
     */
    public goToOrg(orgId) {
      Cookie.set('IsValidUser', "Yes");
    //  if(orgId !== '-1') {
        FilterDataHandler.getInstance().setOrganization(orgId);
        Cookie.set('SelectedOrgId', orgId); 
     // }
      this.rout.navigate(['/video/store']);
      this.dialog.hide();
    }

}
