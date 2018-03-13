import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PAYMENT_GET, API_PAYMENT_LIST } from "../../../../../app-constants";
import { PM } from '../../_models/trns/pm';

@Injectable()
export class PMService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {

        return this.http.post(API_PAYMENT_LIST, JSON.stringify({ payment_id: "" }), super.jwt())
            .map((response: Response) => response.json());
        // var dataJSONArray = JSON.parse('[{"payment_id":1, "workflow_id":1, "matdoc_no":"5000128819", "doc_year":"2017", "status":"CREATE", "comp_code":"8336", "comp_name":"บจก.แอสเสท เวิรด์ โฮเทล", "plant_code":"3360", "plant_name":"แอสเสท เวิรด์ โฮเทล", "po_no":"4500086474", "vendor_code":"1004723", "vendor_name":"บจก.ไอ.ที.โซลูชั่น", "entry_date":"25/07/2017", "entry_time":"09:41:37", "change_date":"xx", "header_text":"xx", "bu":"xx", "doc_type":"WE", "doc_date":"25/07/2017", "post_date":"25/07/2017", "create_user":"HGIT01", "reference_doc":"INV6004125", "amount":66240.00, "currency":"THB", "tcode":"MIGO_GR", "tracking_no":"218" }]');
        // return dataJSONArray;
    }

    public get<T>(id: string) {

        return this.http.get(API_PAYMENT_GET + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public put<T>(pm: PM) {

        return this.http.put(API_PAYMENT_GET + '/' + pm.payment_id, pm, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    // public del(id: string) {

    //     return this.http.delete(API_PAYMENT_GET_PUT_DEL + '/' + id, super.jwt())
    //         .map((response: Response) => response.json());
    // }
}