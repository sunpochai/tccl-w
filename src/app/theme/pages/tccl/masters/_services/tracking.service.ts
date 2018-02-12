import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class TrackingService {

    constructor(private http: Http) {
    }

    public loaddata( ) {
        return this.http.get('https://keenthemes.com/metronic/preview/inc/api/datatables/demos/default.php') 
            .map((response: Response) =>  response.json() );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}