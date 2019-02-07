import { Observable } from 'rxjs/Rx';
import { Campaign, CampaignResponse } from './../model/campaign.model';
import { WorkerList} from './../model/list.model';
import { Worker } from './../model/worker.model';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpRequest } from './../services/HttpRequest';
/**
 * Created by anoop on 07-06-2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class CampaignService {

  constructor(private http: HttpRequest) {
   
  }

  getEmptyCampaign() {
    return {
      messageType: "App",
      workers: [],
      lists: [],
    };
  }

  loadCampaigns() {
    let that = this;
    return this.http.get( 'campaign')
      .map(response => {
        let list = new Array<Campaign>();
        let res = response.json();
        let rsponseStatus = response.status;
        list.push(...res);
        return list;
      }).share();
  }

  getCampaignDetail(id: string){
    let listObservable: Observable<Campaign>  = this.http.get('campaign/'+id)
    .map((res) => res.json())
    .concatMap((campaign) => {
      return Observable.forkJoin(this.getWorker(campaign),this.getList(campaign), (...results) => {
        campaign.workers = results[0];
        campaign.lists = results[1];
        return campaign;
      })
    });
    return listObservable;
  }

  getWorker(campaign){
    if(campaign.workers.length == 0)
      return Observable.of([]);
    let observables = campaign.workers.map((workerId) => {
      return this.http.get('worker/'+workerId)
        .map((r: Response) =>  r.json())
    });
    return Observable.forkJoin(observables, (...workers) => {
      return workers;
    });
  }

  getList(campaign){
    if(campaign.lists.length == 0)
      return Observable.of([]);
    let observables = campaign.lists.map((listId) => {
      return this.http.get('workerlist/'+listId)
        .map((r: Response) =>  r.json())
    });
    return Observable.forkJoin(observables, (...lists) => {
      return lists;
    })
  }

  removeCampaign(id: string){
    let that = this;
    let delObservableOfView = this.http.delete( 'campaign/'+id);
    return delObservableOfView;
  }

  saveCampaign(campaign: Campaign){
    let that = this;
    let campaignBody: CampaignResponse = {
      name: campaign.name,
      messageType: campaign.messageType,
      autoReply: campaign.autoReply,
      workers: campaign.workers.map((worker: Worker)=>{ return worker._id;}),
      lists: campaign.lists.map((list: WorkerList)=>{ return list._id;})
    };
    if(campaign._id){
      campaignBody._id = campaign._id;
    }  
    let saveObservable = this.http.post( 'campaign', campaign)
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
    return Observable.forkJoin(this.getWorkers(filter),this.getLists(filter), (...results) => {
        return results[1].concat(results[0]);
    })
  }

  getWorkers(filter){
    return this.http.get( 'worker?limit=20&filter='+filter).map(
      (res) => res.json().map(worker => {
          worker.displayName = worker.name.last_name + " " + worker.name.first_name;
          return worker;
        } )
    );
  }

  getLists(filter){
    return this.http.get( 'workerlist?limit=20&filter='+filter).map(
      (res) => res.json().map(list => {
          list.displayName = list.name;
          return list;
        } )
    );
  }
}
