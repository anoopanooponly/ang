
/**********************************************************************************
* File Name   :   Store.ts
* Description :   Store
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/

import { Subject } from 'rxjs/Subject';
export class Store {
    id: string;
    name: string;
    shortName: string;
    organization?: string;
    type?: string;
    cameraList?: any;
    itemCount?:number;
    noCameraFound?:boolean;
    // Observable string streams

    constructor() {
       //this.cameraList = new Subject().asObservable();
    }
}
