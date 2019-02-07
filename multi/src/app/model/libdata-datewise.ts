
/**********************************************************************************
* File Name   :   LibdataDatewise.ts
* Description :   LibdataDatewise
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { LibCamera } from './lib-camera';
export class LibdataDatewise {
    itemCount :number;
    pageCount:number;
    currentPageNo:number;
    cameraList : Array<LibCamera>;
    cameraShortList:Array<LibCamera>;
    createdDate:string;
    clipDate:string;
}
