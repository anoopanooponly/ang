import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import {CompanyService} from "../company.service";
import { Company } from '../../model/company.model';

@Injectable()
export class CompanyDetailResolver implements Resolve<Observable<Company>> {
  constructor(
    private companyService: CompanyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if(route.params.id)
      return this.companyService.getCompanyDetail(route.params.id);
    else
      return Observable.of(this.companyService.getEmptyCompany());
  }
}
