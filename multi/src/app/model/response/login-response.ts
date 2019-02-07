
/**********************************************************************************
* File Name   :   LoginResponse.ts
* Description :   LoginResponse
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

export class LoginResponse {
    status: boolean;
    errorCode: number;
    errorMessage: string;
    authToken: string;
}
