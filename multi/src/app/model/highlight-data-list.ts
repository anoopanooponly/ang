
/**********************************************************************************
* File Name   :   HighlightDataList.ts
* Description :   HighlightDataList
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { LibCamera } from './lib-camera';
export class HighlightDataList{
    itemCount :number;
    pageCount:number;
    currentPageNo:number;
    cameraList : Array<LibCamera>;
    cameraShortList : Array<LibCamera>;
    createdDate:string;
    clipDate:string;
    storeId:string;
    reelId:string;
    reelName:string;
}
