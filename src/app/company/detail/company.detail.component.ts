import { Component, OnInit, ViewChild, Input, SimpleChanges, NgModule, NgZone} from '@angular/core';
import { FormControl, FormsModule, NgForm, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import {Router, ActivatedRoute} from '@angular/router'

import {CompanyService} from "../company.service";
import { Company } from '../../model/company.model';
import {TagInputComponent} from 'angular2-tag-input';
import { ModalDirective } from 'ngx-bootstrap';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {} from '@types/googlemaps';
import _ from "lodash";
import { CustomValidators } from '../../services/custom.validator';

@Component({
  selector: 'company-detail',
  templateUrl: './company.detail.component.html',
  styleUrls: ['./company.detail.component.css'],

})
export class CompanyDetailComponent implements OnInit  {  
  @Input() startTime: Date;
  @Input() endTime: Date;
  @ViewChild("search") public searchElementRef: any;
  @ViewChild('locationModal') public locationModal:ModalDirective;
  @ViewChild('shiftModal') public shiftModal:ModalDirective;
  @ViewChild('companyForm') companyForm: NgForm;
  //@ViewChild('shiftForm') shiftForm: NgForm;
  @ViewChild('locationForm') locationForm: NgForm;
  shiftForm: FormGroup;
  shiftDays: FormGroup;

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public locTxt: String = "";
  public searchControl: FormControl;
  public autocomplete: google.maps.places.Autocomplete;

  private companyService: CompanyService;

  private company:any = {};
  private shift: any = {};
  private location: any = {};
  private repeatInd: number = 0;

  constructor(private router: Router, private activatedRoute:ActivatedRoute, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, companyService: CompanyService, private fb: FormBuilder) { 
    
    this.companyService = companyService;
  }

  ngOnInit() {
    this.activatedRoute.data.pluck('company').subscribe( company => {
      this.company = company;
    }, err => {});
    this.initMap();
    this.initDate();
    this.shiftDays = this.getShiftDaysGroup();
    this.shiftForm = this.fb.group({
      name: ['', [Validators.required]],
      days: this.shiftDays
    });
  }

  getShiftDaysGroup() {
    return this.fb.group({
      Sunday: [false],
      Monday: [false],
      Tuesday: [false],
      Wednesday: [false],
      Thursday: [false],
      Friday: [false],
      Saturday: [false]
    }, {
      validator: CustomValidators.multipleCheckboxRequireOne.bind(this)
    });
  }

  private initDate(){
    this.startTime = new Date();
    this.endTime = new Date();
    let minutes = this.startTime.getMinutes();
    let rem = minutes%5;
    if(rem > 0)
      this.startTime.setMinutes(minutes-rem);
    minutes = this.endTime.getMinutes();
    rem = minutes%5;
    if(rem > 0)
      this.endTime.setMinutes(minutes-rem);    
  }

  private initMap() {
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.zoom = 12;
    //create search FormControl
    this.searchControl = new FormControl();
    
    //set current position
    //this.setCurrentPosition();
    
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.initMapAutoComplete();
    });
  }

  private initMapAutoComplete(){
    this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ["address"]
    });
    this.autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        this.onPlaceChange();
      });
    });
  }

  private onPlaceChange() {
    let place: google.maps.places.PlaceResult =  this.autocomplete.getPlace();
    //verify result
    if (place === undefined || place.geometry === undefined || place.geometry === null) {
      return;
    }    
    //set latitude, longitude and zoom
    this.latitude = place.geometry.location.lat();
    this.longitude = place.geometry.location.lng();
    this.zoom = 12;

    this.location.lat = place.geometry.location.lat();
    this.location.lng = place.geometry.location.lng();
    this.location.address = this.getPlaceValue(place, "route", "long_name");
    this.location.city = this.getPlaceValue(place, "locality", "long_name");
    this.location.province = this.getPlaceValue(place, "administrative_area_level_1", "long_name");
    this.location.country = this.getPlaceValue(place, "country", "long_name");
    this.location.postalCode = this.getPlaceValue(place, "postal_code", "short_name");
  }

  private getPlaceValue(place: google.maps.places.PlaceResult, type, attr) {
    for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (type === addressType) {
            return place.address_components[i][attr];
          }
        }
        return "";
  }
  
  private setCurrentPosition() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
  }

  saveCompany() {
    let id = this.company._id;
    this.companyService.saveCompany(this.company).subscribe( company => {
      if(id != null)
        this.router.navigate(['../../'],{relativeTo: this.activatedRoute});
      else
        this.router.navigate(['../'],{relativeTo: this.activatedRoute});
    }, err => {

    });
  }

  showNewLocationModal() {
    this.locTxt = "";
    this.location = {
      enabled: true
    };
    this.locationModal.show();
  }

  addLocation() {    
    this.company.locations[this.company.locations.length] = this.location;
    this.hideLocationModal();
  }

  hideLocationModal(){
    this.locationModal.hide();
  }
  
  removeLocation(index) {
    let loc = this.company.locations[index];
    if(loc._id == null)
      this.company.locations.splice(index, 1);
    else
      loc.enabled = false;
  }

  changeRepeat() {
    this.setRepeatDays(this.repeatInd)
  }

  setRepeatDays(mode){
    let keys = Object.keys(this.shiftDays.controls);
    for(let key of keys) {
      let ctrl = this.shiftDays.get(key);
      if(mode == 1) {
        ctrl.setValue(true);
        ctrl.disable();
      } else {
        ctrl.enable()
      }
    }
  }

  resetShiftData() {
    this.repeatInd = 0;
    this.initDate();
    let keys = Object.keys(this.shiftDays.controls);
    for(let key of keys) {
      let ctrl = this.shiftDays.get(key);
        ctrl.setValue(false);
    }
  }

  showShiftModal() {    
    this.shiftModal.show();
  }

  hideShiftModal() {    
    this.shiftModal.hide();
    this.shiftForm.reset();
    this.resetShiftData();
  }

  addShift() {
    this.setRepeatDays(0);
    let shiftObj:any = this.shiftForm.value;
    shiftObj.start = this.startTime.getHours() + (this.startTime.getMinutes()*.01);
    shiftObj.end = this.endTime.getHours() + (this.endTime.getMinutes()*.01);
    shiftObj.enabled = true;
    this.company.shifts[this.company.shifts.length] = shiftObj; 
    this.hideShiftModal();
  }

  removeShift(index) {
    let shift = this.company.shifts[index];
    if(shift._id == null)
      this.company.shifts.splice(index, 1);
    else
      shift.enabled = false;
  }

  getTimeIn12HrFormat(time: number){
    let hours = time|0;
    let mm = Math.round((time - hours) * 100);
    let hh = hours%12;
    let mode = hours/12|0;
    let ret = "" + (hh == 0 ? (mode == 1 ? "12" : "00"): hh);
    ret += mm > 0 ? ":" + mm : "";
    return ret + " " + (mode == 1 ? "pm" : "am");
  }

  getLocationText(location: any){
    let loc = "";    
    if (location.address != null && location.address.length > 0) {
      loc += location.address;
    }
    if (location.city != null && location.city.length > 0) {
      if(loc.length > 0)
        loc += ",";
      loc += location.city;
    }
    if (location.province != null && location.province.length > 0) {
      if(loc.length > 0)
        loc += ",";
      loc += location.province;
    }
    if (location.country != null && location.country.length > 0) {
      if(loc.length > 0)
        loc += ",";
      loc += location.country;
    }
    return loc;
  }

  getCurrLocation(){
    return this.getLocationText(this.location);
  }

  getShiftRepeatDesc(shift: any) {
    let desc = {
      arr: new Array(),
      start: "",
      end: ""
    };
    this.getDayDesc("Sunday", shift.days.Sunday, desc);
    this.getDayDesc("Monday", shift.days.Monday, desc);
    this.getDayDesc("Tuesday", shift.days.Tuesday, desc);
    this.getDayDesc("Wednesday", shift.days.Wednesday, desc);
    this.getDayDesc("Thursday", shift.days.Thursday, desc);
    this.getDayDesc("Friday", shift.days.Friday, desc);
    this.getDayDesc("Saturday", shift.days.Saturday, desc);
    let str:string;
    if(desc.start == "Sunday" && desc.end == "Saturday" )
      str = "Daily";
    else {      
      if(desc.start.length > 0){
        if(desc.start == desc.end)
          desc.arr.push(desc.start);
        else
          desc.arr.push(desc.start + " to " + desc.end);
      }
      str = "Weekly on " + desc.arr.join(", ");
    }
    return str;
  }

  getDayDesc(name, flag, desc) {
    if (flag) {
      if(desc.start.length == 0)
        desc.start = name;
      desc.end = name;  
    } else {
      if(desc.start.length > 0) {
        this.pushRepeatString(desc);
        desc.start = "";
        desc.end = "";
      }
    }
  }

  pushRepeatString(desc) {
    if(desc.start == desc.end)
      desc.arr.push(desc.start);
    else
      desc.arr.push(desc.start + " to " + desc.end);
  }

}
