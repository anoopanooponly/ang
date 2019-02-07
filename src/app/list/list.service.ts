import {Observable} from 'rxjs/Rx';
import { WorkerList, WorkerResponse } from './../model/list.model';
import { Worker } from './../model/worker.model';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpRequest } from './../services/HttpRequest';

/**
 * Created by anoop on 07-06-2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class ListService {

  constructor(private http: HttpRequest) {   
  }

  getEmptyList() {
    return {
      workers: [],
      imported:[]
    };
  }

  loadLists() {
    let that = this;
    return this.http.get( 'workerlist')
      .map(response => {
        let list = new Array<WorkerList>();
        let res = response.json();
        let rsponseStatus = response.status;
        list.push(...res);
        return list;
      }).share();
  }

  getListDetail(id: string){
    let listObservable: Observable<WorkerList>  = this.http.get('workerlist/'+id)
    .map((res) => res.json())
    .concatMap((workerlist) => {
      if(workerlist.workers.length == 0)
        return Observable.of([]);
      let observables = workerlist.workers.map((workerId) => {
        return this.http.get('worker/'+workerId)
          .map((r: Response) =>  r.json())
      });
      return Observable.forkJoin(observables, (...workers) => {
        workerlist.workers = workers;
        return workerlist;
      })
    });
    return listObservable;
  }

  removeList(id: string){
    let that = this;
    let delObservableOfView = this.http.delete( 'workerlist/'+id);
    return delObservableOfView;
  }

  saveList(list: WorkerList){
    let that = this;
    let listBody: WorkerResponse = {
      name: list.name,
      type: list.type,
      workers: list.workers.map((worker: Worker)=>{ return worker._id;}),
      imported: list.imported
    };
    if(list._id){
      listBody._id = list._id;
    }  
    let saveObservable = this.http.post( 'workerlist', listBody)
      .map(this.extractData).catch(this.handleErrorObservable);
    return saveObservable;
  }

  private extractData(res: Response) {
	  let body = res.json();
    return body.data || {};
  }

  handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  loadWorkers( filter) {
    return this.http.get( 'worker?limit=20&filter='+filter)
      .map((res) => res.json()
        .map(worker => {
          worker.displayName = worker.name.last_name + " " + worker.name.first_name;
          return worker;
        })
      );
  }

}
