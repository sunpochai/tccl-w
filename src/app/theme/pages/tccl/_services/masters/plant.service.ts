import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PLANT_GETALL, API_PLANT_LIST, API_PLANT_GET_PUT_DEL, API_PLANT_INSERT } from "../../../../../app-constants";
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

    public loaddata() {
        return this.http.post(API_PLANT_LIST, JSON.stringify({ plant_code: "", plant_name: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {
        return this.http.get(API_PLANT_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public create<T>(plant: Plant) {
        return this.http.post(API_PLANT_INSERT, plant, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public put<T>(plant: Plant) {
        return this.http.put(API_PLANT_GET_PUT_DEL + '/' + plant.plant_code, plant, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    
    public del(id: string) {
        return this.http.delete(API_PLANT_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}