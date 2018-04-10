import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_SPECIALUSER_ADMINLIST, API_SPECIALUSER_OWNERLIST, API_SPECIALUSER_GET_PUT_DEL, API_SPECIALUSER_INSERT, SPECIAL_USER_ADMIN } from "../../../../../app-constants";
import { SpecialUser } from '../../_models/config/specialuser';

@Injectable()
export class SpecialUserService extends TokenBaseService {
    constructor(private http: Http) {
        super();
    }

    /* public loaddata(spcluser_type: string) {
        if (spcluser_type == SPECIAL_USER_ADMIN.name) {
            //admin
            return this.http.post(API_SPECIALUSER_ADMINLIST, super.jwt())
                .map((response: Response) => response.json());
        } else {
            //owner
            return this.http.post(API_SPECIALUSER_OWNERLIST, super.jwt())
                .map((response: Response) => response.json());
        }
    } */

    public get<SpecialUser>(id: string) {
        return this.http.get(API_SPECIALUSER_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <SpecialUser>response.json());
    }

    public create<T>(reviewer: SpecialUser) {
        return this.http.post(API_SPECIALUSER_INSERT, reviewer, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public del(id: string) {
        return this.http.delete(API_SPECIALUSER_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}