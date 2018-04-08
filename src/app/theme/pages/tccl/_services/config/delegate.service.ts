import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_DELEGATE_GET_PUT_DEL, API_DELEGATE_INSERT, API_DELEGATE_LIST } from "../../../../../app-constants";
import { Delegate } from '../../_models/config/delegate';

@Injectable()
export class DelegateService extends TokenBaseService {
    constructor(private http: Http) {
        super();
    }

    public loaddata() {
        return this.http.post(API_DELEGATE_LIST, super.jwt())
            .map((response: Response) => response.json());
    }

    public get<Delegate>(id: string) {
        return this.http.get(API_DELEGATE_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <Delegate>response.json());
    }

    public create<T>(delegate: Delegate) {
        return this.http.post(API_DELEGATE_INSERT, delegate, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public put<T>(delegate: Delegate) {
        return this.http.put(API_DELEGATE_GET_PUT_DEL + '/' + delegate.delegate_id, delegate, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public del(id: string) {
        return this.http.delete(API_DELEGATE_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}