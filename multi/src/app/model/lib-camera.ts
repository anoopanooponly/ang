
/**********************************************************************************
* File Name   :   LibCamera.ts
* Description :   LibCamera
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

export class LibCamera {
    exportId: string;
    status: string;//
    percentComplete: number;
    displayPercentComplete: boolean;
    createdTime: string;
    startTime: string;
    endTime: string;
    type: string;
    cameraId: string;
    cameraUid: string;
    siteName: string;
    cameraName: string;
    thumbnailUrl: string;
    thumbnailUrlHighRes: string;
    videoURL:string;
    timeZone:string;
    selected:boolean;
    displayName:string;
    displayDescription:string;
    videoTitle:string;
}
