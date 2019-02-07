/**********************************************************************************
* File Name   :   CookieService.ts
* Description :   This class implements Cookies set and get methods 
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 25-Sep-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Injectable } from '@angular/core';
import { DateFormat } from './../model/date-format';

@Injectable()
export class CookieService {

  /**
   * Creates an instance of CookieService.
   * 
   * @memberOf CookieService
   */
  constructor() { }

  /**
   * 
   * 
   * 
   * @memberOf CookieService
   */
  clearAllCookies() {
    Cookie.deleteAll();
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieSelectedStore(cookieValue: string) {
    Cookie.set('SelectedStore', cookieValue);
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieSelectedView(cookieValue: string) {
    Cookie.set('SelectedView', cookieValue);
  }

  setCookieHeatmapOn(cookieValue: boolean) {
    Cookie.set('HeatmapOn', cookieValue ? 'On' : 'Off');
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookiePlayBacklocal() {
    var c = Cookie.get('isPlayBacklocal');
    return c == 'On' ? true : false;
  }

  /**
   * 
   * 
   * @param {boolean} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookiePlayBacklocal(cookieValue: boolean) {

    Cookie.set('isPlayBacklocal', cookieValue ? 'On' : 'Off');
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapOn() {
    var c = Cookie.get('HeatmapOn');
    return c == 'On' ? true : false;
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieSelectedStore() {
    return Cookie.get('SelectedStore');
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieSelectedView() {
    return Cookie.get('SelectedView');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieVideoType(cookieValue: string) {
    Cookie.set('VideoType', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieVideoType() {
    return Cookie.get('VideoType');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieGroupBy(cookieValue: string) {
    Cookie.set('GroupBy', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieGroupBy() {
    return Cookie.get('GroupBy');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHLGroupBy(cookieValue: string) {
    Cookie.set('HLGroupBy', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHLGroupBy() {
    return Cookie.get('HLGroupBy');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieLibVisibility(cookieValue: string) {
    Cookie.set('LibVisibility', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieLibVisibility() {
    return Cookie.get('LibVisibility');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapLargeRange(cookieValue: string) {
    Cookie.set('HeatmapLargeRange', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapLargeRange() {
    return Cookie.get('HeatmapLargeRange');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapLargeFromDate(cookieValue: string) {
    Cookie.set('HeatmapLargeFromDate', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapLargeFromDate() {
    return Cookie.get('HeatmapLargeFromDate');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapLargeToDate(cookieValue: string) {
    Cookie.set('HeatmapLargeToDate', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapLargeToDate() {
    return Cookie.get('HeatmapLargeToDate');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapComparisonCameraId(cookieValue: string) {
    Cookie.set('HeatmapComparisonCameraId', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapComparisonCameraId() {
    return Cookie.get('HeatmapComparisonCameraId');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapFromDate(cookieValue: string) {
    Cookie.set('HeatmapFromDate', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapFromDate() {
    return Cookie.get('HeatmapFromDate');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapToDate(cookieValue: string) {
    Cookie.set('HeatmapToDate', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapToDate() {
    return Cookie.get('HeatmapToDate');
  }

  /**
   * 
   * 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieStoreZone(cookieValue: string) {
    Cookie.set('HeatmapStoreZone', cookieValue);
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieStoreZone() {
    return Cookie.get('HeatmapStoreZone');
  }
  
  /**
   * 
   * 
   * @param {boolean} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieHeatmapSingleWindowOn(cookieValue: boolean) {
    Cookie.set('HeatmapSingleWindowOn', cookieValue ? 'On' : 'Off');
  }

  /**
   * 
   * 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieHeatmapSingleWindowOn() {
    var c = Cookie.get('HeatmapSingleWindowOn');
    return c == 'On' ? true : false;
  }
 /**
   * 
   * 
   * @param {string} key 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookieOrg(cookieValue: string) {
    Cookie.set('Org', cookieValue);
  }

  /**
   * 
   * 
   * @param {string} key 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookieOrg() {
   return Cookie.get('Org');
  }
  /**
   * 
   * 
   * @param {string} key 
   * @param {string} cookieValue 
   * 
   * @memberOf CookieService
   */
  setCookie(key: string, cookieValue: string) {
    Cookie.set(key, cookieValue);
  }

  /**
   * 
   * 
   * @param {string} key 
   * @returns 
   * 
   * @memberOf CookieService
   */
  getCookie(key: string) {
    return Cookie.get(key);
  }

  

  /**
   * 
   * 
   * @param {string} key 
   * 
   * @memberOf CookieService
   */
  deleteCookie(key: string) {
    Cookie.delete(key);
  }

}
