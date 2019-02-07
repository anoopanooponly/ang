
/**********************************************************************************
* File Name   :   Camera.ts
* Description :   Camera
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

export class Camera {
   id: string;
   uid: string;
   name: string;
   storeName: string;
   description: string;
   status:boolean;
   thumbnailUrl:string;
   heatmapUrl:string;
   heatmapUrlOld:string;
   timezone:string;
   thumbnailUrlOld:string;
   isOnline:boolean;
   heatmapCam1Url:string;
   heatmapCam2Url:string;
   gatewayIp:string;
   uploadKbps:string;
   posterUrl:string;
}
