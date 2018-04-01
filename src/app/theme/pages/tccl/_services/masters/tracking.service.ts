import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { API_TRACKING_SEARCH, API_TRACKING_LIST, API_TRACKING_GET_PUT_DEL, API_TRACKING_INSERT, API_TRACKING_GETALL } from "../../../../../app-constants";
import { TokenBaseService } from "../tokenbase.service";
import { Tracking } from "../../_models/masters/tracking";

@Injectable()
export class TrackingService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public search(textSearch) {
        return this.http.post(API_TRACKING_SEARCH, JSON.stringify({ textSearch: textSearch, }), super.jwt())
            .map((response: Response) => response.json());
    }

    public getall() {
        return this.http.get(API_TRACKING_GETALL, super.jwt())
            .map((response: Response) => response.json());
    }

    public list() {
        return this.http.post(API_TRACKING_LIST, JSON.stringify({ tracking_code: "", tracking_name: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {
        return this.http.get(API_TRACKING_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public create<T>(tracking: Tracking) {
        return this.http.post(API_TRACKING_INSERT, tracking, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public put<T>(tracking: Tracking) {
        return this.http.put(API_TRACKING_GET_PUT_DEL + '/' + tracking.tracking_code, tracking, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public del(id: string) {
        return this.http.delete(API_TRACKING_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}