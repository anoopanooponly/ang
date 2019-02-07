
/**********************************************************************************
* File Name   :   HighlightRealsData.ts
* Description :   HighlightRealsData
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { LibCamera } from './lib-camera';
export class HighlightRealsData {

    id: string;
    name: string;
    type: string;
    startTime: string;
    endTime:string;
    cameraList : Array<LibCamera>;
    itemCount:number;
    pageCount:number;
}
