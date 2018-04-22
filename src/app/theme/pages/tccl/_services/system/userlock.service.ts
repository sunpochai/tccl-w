import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_USERLOCK_LIST, API_USERLOCK_GET_PUT_DEL, API_USERLOCK_INSERT } from "../../../../../app-constants";
import { UserLock } from '../../_models/system/userlock';

@Injectable()
export class UserLockService extends TokenBaseService {
    constructor(private http: Http) {
        super();
    }

    public get<UserLock>(id: string) {
        return this.http.get(API_USERLOCK_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <UserLock>response.json());
    }

    public create<T>(userlock: UserLock) {
        return this.http.post(API_USERLOCK_INSERT, userlock, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public del(id: string) {
        return this.http.delete(API_USERLOCK_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}