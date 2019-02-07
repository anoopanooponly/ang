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
  public  write(key: string, value: any) {
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
  public  read<T>(key: string): T {
        let value: string = localStorage.getItem(key);

        if (value && value !== 'undefined' && value !== 'null') {
            return <T> JSON.parse(value);
        }

        return null;
    }

    public clearAll(): void {
         localStorage.clear();
    }

    public clear(key: string): void {
         localStorage.removeItem(key);
    }
}
