import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_COMPANY_LIST, API_COMPANY_GET, API_COMPANY_PUT, API_COMPANY_DEL, API_COMPANY_INSERT } from "../../../../../app-constants";
import { Company } from '../../_models/masters/company';

@Injectable()
export class CompanyService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {

        return this.http.post(API_COMPANY_LIST, JSON.stringify({ comp_code: "", comp_name: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {

        return this.http.get(API_COMPANY_GET + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    public create<T>(company: Company) {

        return this.http.post(API_COMPANY_INSERT, company, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    public put<T>(company: Company) {

        return this.http.put(API_COMPANY_PUT + '/' + company.comp_code, company, super.jwt())
            .map((response: Response) => <T>response.json());
    }
    public del(id: string) {

        return this.http.delete(API_COMPANY_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}