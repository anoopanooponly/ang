import { Injectable } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  Headers,
  Request
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ApiBuilder } from './api.builder.service';

// Shows Progress bar and notifications
//import { NotifyService } from "./loader";

@Injectable()
export class HttpRequest extends Http {

  constructor(
    backend: ConnectionBackend,
    defaultOptions: RequestOptions,
    private apiBuilder: ApiBuilder
    //private notifyService: NotifyService
  ) {
    
    super(backend, defaultOptions);
    
  }

  /**
   * Performs a request with `get` http method.
   * @param url
   * @param options
   * @returns {Observable<>}
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.beforeRequest();
    return this.handle(super.get(this.getFullUrl(url), this.requestOptions(options)));
  }

  /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
      this.beforeRequest();
      return this.handle(super.post(this.getFullUrl(url), body, this.requestOptions(options)));
    }
    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
      this.beforeRequest();
      return this.handle(super.put(this.getFullUrl(url), body, this.requestOptions(options)))
    }
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<Response>{
      this.beforeRequest();
      return this.handle(super.delete(this.getFullUrl(url), this.requestOptions(options)));
    }
    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>{
      this.beforeRequest();
      return this.handle(super.patch(this.getFullUrl(url), body, this.requestOptions(options)));
    }
    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<Response>{
      this.beforeRequest();
      return this.handle(super.head(this.getFullUrl(url), this.requestOptions(options)));
    }
    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<Response>{
      this.beforeRequest();
      return this.handle(super.options(this.getFullUrl(url), this.requestOptions(options)));
    }
  
  
  handle(req: Observable<any>): Observable<any>{
    return req.catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        console.log("Error", error);
        this.onError(error);
      })
      .finally(() => {
        this.onFinally();
      });
  }
  /**
   * Request options.
   * @param options
   * @returns {RequestOptionsArgs}
   */
  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers({
        //'Authorization': `Basic ${environment.basic_auth_token}`,
        'Authorization': localStorage.getItem('token')
      });
    }
    console.log("options.headers", options.headers);
    return options;
  }

  /**
   * Build API url.
   * @param url
   * @returns {string}
   */
  private getFullUrl(url: string): string {
    return this.apiBuilder.getAPIBaseURL() + '/site/' + url;
  }

  /**
   * Before any Request.
   */
  private beforeRequest(): void {
    //this.notifyService.showPreloader();
  }

  /**
   * After any request.
   */
  private afterRequest(): void {
    //this.notifyService.hidePreloader();
  }

  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    //this.notifyService.popError();
    return Observable.throw(error);
  }

  /**
   * onSuccess
   * @param res
   */
  private onSuccess(res: Response): void {
    console.log(res);
  }

  /**
   * onError
   * @param error
   */
  private onError(error: any): void {
    //this.notifyService.popError();
  }

  /**
   * onFinally
   */
  private onFinally(): void {
    this.afterRequest();
  }
}