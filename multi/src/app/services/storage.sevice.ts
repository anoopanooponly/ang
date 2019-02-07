
/**********************************************************************************
* File Name   :   StorageService.ts
* Description :   This angular service to save and retrive data to and from localStorage.
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Injectable } from '@angular/core';

/**
 * 
 * 
 * @export
 * @class StorageService
 */
@Injectable()

export class StorageService {

    /**
     * 
     * 
     * @param {string} key
     * @param {*} value
     * 
     * @memberOf StorageService
     */
    write(key: string, value: any) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    /**
     * 
     * 
     * @template T
     * @param {string} key
     * @returns {T}
     * 
     * @memberOf StorageService
     */
    read<T>(key: string): T {
        let value: string = localStorage.getItem(key);

        if (value && value != "undefined" && value != "null") {
            return <T>JSON.parse(value);
        }

        return null;
    }

    clearAll(): void {
        //localStorage.clear();
        this.removeItem('org');
        this.removeItem('clip');
        // this.removeItem('Settings');
        this.removeItem('playerCalender');
        this.removeItem('heatmapCal');
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

   
}