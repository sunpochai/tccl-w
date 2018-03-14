import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { API_COMPANY_LIST, API_TRACKING_SEARCH } from "../../../../../app-constants";
import { TokenBaseService } from "../tokenbase.service";

@Injectable()
export class TrackingService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {
        return this.http.get('https://keenthemes.com/metronic/preview/inc/api/datatables/demos/default.php')
            .map((response: Response) => response.json());
    }

    public search(textSearch) {

        return this.http.post(API_TRACKING_SEARCH, JSON.stringify({ textSearch: textSearch, }), super.jwt())
            .map((response: Response) => response.json());
    }
}