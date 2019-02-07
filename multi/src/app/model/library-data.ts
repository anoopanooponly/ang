
/**********************************************************************************
* File Name   :   LibraryData.ts
* Description :   LibraryData
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { LibCamera } from './lib-camera';
export class LibraryData {
    itemCount :number;
    pageCount:number;
    currentPageNo:number;
    cameraList : Array<LibCamera>;
    storeId: string;
}
