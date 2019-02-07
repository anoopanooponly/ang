import { Observable } from 'rxjs/Rx';
import { Company } from './../model/company.model';
import { ApiBuilder } from './../services/api.builder.service';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpRequest } from './../services/HttpRequest';
/**
 * Created by anoop on 07-06-2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class CompanyService {
  public company = {
    shifts: []
  };
  private observable: Observable<any>;
  private companyObservableOfView: Observable<any>;
  private companyDetObservableOfView: Observable<any>;
  constructor(private http: HttpRequest) {
   
  }

  getEmptyCompany() {
    return {
      shifts: [],
      locations:[]
    };
  }

  loadCompanies() {
    let that = this;
    this.companyObservableOfView = this.http.get( 'company')
      .map(response => {
        let list = new Array<Company>();
        let res = response.json();
        that.companyObservableOfView = null;
        let rsponseStatus = response.status;
        list.push(...res);
        return list;
      }).share();
    return this.companyObservableOfView;
  }

  getCompanyDetail(id: string){
    return this.http.get( 'company/'+id)
      .map(response => {
        return response.json();
      }).share();
  }

  removeCompany(id: string){
    let that = this;
    let delObservableOfView = this.http.delete( 'company/'+id);
    return delObservableOfView;
  }

  saveCompany(company: Company){
    let that = this;
    let saveObservable = this.http.post( 'company', company)
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

  setCompany(company){
       this.company = company;
  }

   getCompany(){
      return this.company;
  }

}
