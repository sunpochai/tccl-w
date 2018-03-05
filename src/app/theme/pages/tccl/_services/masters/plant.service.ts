import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PLANT_GETALL } from "../../../../../app-constants";
import { Plant } from '../../_models/masters/plant';

@Injectable()
export class PlantService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public getall() {

        return this.http.get(API_PLANT_GETALL, super.jwt())
            .map((response: Response) => response.json());
    }

}