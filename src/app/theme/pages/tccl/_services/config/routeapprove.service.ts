import { API_ROUTE_UPLOAD, API_ROUTE_IMPORT } from './../../../../../app-constants';
import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_ROUTE_GET_PUT_DEL, API_ROUTE_PR_LIST, API_ROUTE_PO_LIST, API_ROUTE_PA_LIST, API_ROUTE_INSERT } from "../../../../../app-constants";
import { RouteApprove } from '../../_models/config/routeapprove';

@Injectable()
export class RouteApproveService extends TokenBaseService {
    constructor(private http: Http) {
        super();
    }

    //parameter p_doc_group: number
    public loaddata(p_doc_group: number) {
        var api_path = '';
        switch (p_doc_group) {
            case 1: api_path = API_ROUTE_PR_LIST; break;
            case 2: api_path = API_ROUTE_PO_LIST; break;
            case 3: api_path = API_ROUTE_PA_LIST; break;
        }
        return this.http.post(api_path, super.jwt())
            .map((response: Response) => response.json());
    }

    public get<RouteApprove>(id: string) {
        return this.http.get(API_ROUTE_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <RouteApprove>response.json());
    }

    public create<T>(routeapprove: RouteApprove) {
        return this.http.post(API_ROUTE_INSERT, routeapprove, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public put<T>(routeapprove: RouteApprove) {
        return this.http.put(API_ROUTE_GET_PUT_DEL + '/' + routeapprove.route_id, routeapprove, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public del<T>(id: string) {
        return this.http.delete(API_ROUTE_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public   upload(formData: FormData) {
        let headers = new Headers()
        headers.set('Authorization', 'Bearer ' + super.getToken());
        return  this.http.post(API_ROUTE_UPLOAD, formData, new RequestOptions({ headers: headers }))
            .map((response: Response) => response.json());
    }
    public   import(lot) {
        let headers = new Headers()
        headers.set('Authorization', 'Bearer ' + super.getToken());
        return  this.http.post(API_ROUTE_IMPORT, {lot:lot}, new RequestOptions({ headers: headers }))
            .map((response: Response) => response.json());
    }
}