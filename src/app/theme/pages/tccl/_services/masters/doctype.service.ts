import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_DOCTYPE_LIST, API_DOCTYPE_GET_PUT_DEL, API_DOCTYPE_INSERT, API_DOCTYPE_GETALL } from "../../../../../app-constants";
import { DocType } from '../../_models/masters/doctype';

@Injectable()
export class DocTypeService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public getall() {

        return this.http.get(API_DOCTYPE_GETALL, super.jwt())
            .map((response: Response) => response.json());
    }

    public loaddata() {

        return this.http.post(API_DOCTYPE_LIST, JSON.stringify({ doc_type_code: "", doc_type_desc: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {

        return this.http.get(API_DOCTYPE_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    public create<T>(doctype: DocType) {

        return this.http.post(API_DOCTYPE_INSERT, doctype, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    public put<T>(doctype: DocType) {

        return this.http.put(API_DOCTYPE_GET_PUT_DEL + '/' + doctype.doc_type_code, doctype, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    public del(id: string) {

        return this.http.delete(API_DOCTYPE_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}