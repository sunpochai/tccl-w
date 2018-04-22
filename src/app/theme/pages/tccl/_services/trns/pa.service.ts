import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PA_LIST, API_PA_GET } from "../../../../../app-constants";

@Injectable()
export class PAService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {

        return this.http.post(API_PA_LIST, JSON.stringify({ payment_id: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {

        return this.http.get(API_PA_GET + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }


}