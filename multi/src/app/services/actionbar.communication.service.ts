import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PlayerCalendarData } from './../model/player-calendar-data';
import { DateFormat } from './../model/date-format';

@Injectable()
export class ActionBarCommunicationService {


  private actionSource = new Subject();
  private videoTimeSource = new Subject();
  private scrollSource = new Subject();
  private playerCalendarData = new Subject();
  private downloadSource = new Subject();
  public scrollBarActive = false;

  // Observable string streams
  actionSource$ = this.actionSource.asObservable();
  videoTimeSource$ = this.videoTimeSource.asObservable();
  scrollSource$ = this.scrollSource.asObservable();
  playercalendardata$ = this.playerCalendarData.asObservable();
  downloadSource$ = this.downloadSource.asObservable();


  constructor() {

  }

  // Service message commands
  action(actn: string) {
    this.actionSource.next(actn);
  }

  process(seekTime: string, startTime: string = null, endTime: string = null, id: string = null) {
    this.videoTimeSource.next({ 'message': seekTime, 'startTime': startTime, 'endTime': endTime, 'id': id });
  }

  onscroll() {
    this.scrollBarActive = true;
    this.scrollSource.next();
  }

  notifyPlayer(obj: PlayerCalendarData) {
    this.playerCalendarData.next(obj);
  }

  download() {
   this.downloadSource.next();
  }
}