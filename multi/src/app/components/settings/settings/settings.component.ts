/**********************************************************************************
* File Name   :   SettingsComponent.ts
* Description :   .
*
* Copyright (c) MultiSight™ © 2016 Schneider Electric 
* --------------------------------------------------------------------------------
* Date             Author              Comment
* --------------------------------------------------------------------------------
* 1-Nov-2016      QuEST Team          Initial version created
**********************************************************************************/
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CookieService } from '../../../services/cookie.service';
import { StorageService } from '../../../services/storage.sevice';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],

})
export class SettingsComponent implements OnInit {

  @Output() buttonClicked: EventEmitter<boolean> = new EventEmitter();
  playBack: boolean;
  calObj = {
    playBack: true
  }

  /**
   * Creates an instance of SettingsComponent.
   * @param {CookieService} cookieService 
   * @param {StorageService} storageService 
   * 
   * @memberOf SettingsComponent
   */
  constructor(public cookieService: CookieService, private storageService: StorageService) {
    this.restoreFromStorage();
    //this.playBack = cookieService.getCookiePlayBacklocal();
  }


  /**
   * 
   * 
   * 
   * @memberOf SettingsComponent
   */
  ngOnInit() {

  }


  /**
   * Checks whether user has admin privilage
   * 
   * @returns {boolean}
   * 
   * @memberOf SettingsComponent
   */
  isAdmin(): boolean {
    var c = Cookie.get('adminUser');
    return c == 'On' ? false : true;
  }


  /**
   * Open the administration site in new tab
   * 
   * 
   * @memberOf SettingsComponent
   */
  adminSettings() {
    window.open('https://administration-dev.multisight.com');
  }


  /**
   * To hide the setting dialogue 
   * 
   * 
   * @memberOf SettingsComponent
   */
  onCancelClick() {

    this.buttonClicked.emit(true);
    this.playBack = false;
    this.restoreFromStorage();
  }


  /**
   * Save the settings data to session and hides settings dialogue
   * 
   * 
   * @memberOf SettingsComponent
   */
  onDoneClick() {
    let isplayback: string;
    this.buttonClicked.emit(true);
    this.cookieService.setCookiePlayBacklocal(this.playBack);
    this.saveToStorage();
  }

  /**
   * Save the settings data to session
   * 
   * 
   * @memberOf SettingsComponent
   */
  saveToStorage() {
    this.calObj.playBack = this.playBack;
    this.storageService.write("Settings", JSON.stringify(this.calObj));
  }


  /**
   * Retrive data from session
   * 
   * 
   * @memberOf SettingsComponent
   */
  restoreFromStorage() {
    let calStr: any = this.storageService.read("Settings");
    if (calStr != null && calStr != 'undefined') {
      this.calObj = JSON.parse(calStr);
      if (this.calObj != null) {
        this.playBack = this.calObj.playBack;
      }
    }
    else
    {
      this.playBack = false;
    }
  }
}
