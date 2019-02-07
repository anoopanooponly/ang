
/**********************************************************************************
* File Name   :   AuthData.ts
* Description :   AuthData
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { AccessPermission } from './access-permission';
AccessPermission
export class AuthData {
    userEmail:string;
    loginStatus:boolean;
    logoutStatus: boolean;
    forgotPasswordStatus: boolean;
    inStoreAccess:boolean;
    adminUser:boolean;
    error: any;
    displayOrgList:boolean;
    superUser:boolean;
    organization: Array<AccessPermission>;
}
