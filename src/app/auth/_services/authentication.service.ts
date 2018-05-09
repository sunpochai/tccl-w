import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';
import "rxjs/add/operator/map";
import { API_AUTHEN_TOKEN, API_AUTHEN_CHECKIN, API_AUTHEN_VERIFY, API_AUTHEN_CHECKOUT } from "../../app-constants";
 
@Injectable()
export class AuthenticationService {

 
    constructor(private http: Http) {
    }
   
     verify(): Observable<any> {
          return this.http.get(API_AUTHEN_VERIFY, this.jwt());
         /// return this.isAuthenticated ;
        } 

    login(username, password) {
        let headers = new Headers();
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        let opt = new RequestOptions({ headers: headers });
 
        return this.http.post(API_AUTHEN_TOKEN, "username=" + username + "&password=" +  encodeURIComponent(password) + "&grant_type=password", opt)
            .map(response => response.json());
 
    }
    checkin(token, username, playerid ) {
        // 
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + token);


        let opt = new RequestOptions({ headers: headers });
      
        return this.http.post(API_AUTHEN_CHECKIN, JSON.stringify(
            { userlogin: username, playerid: playerid, platform: "browser" }), opt)
            .map(response => response.json());
    }

    logout(token, username ){
        // remove user from local storage to log user out
        let headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Authorization', 'Bearer ' + token);
        
       let opt = new RequestOptions({ headers: headers });
       this.http.post(API_AUTHEN_CHECKOUT, JSON.stringify({ userlogin: username, playerid: "", platform: "browser"}), opt)
            .map(response => response.json());
        localStorage.removeItem('currentUser');
    }
 
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser.token) {
            let headers = new Headers(
                { 'Authorization': 'Bearer ' + currentUser.token });

            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');

            return new RequestOptions({ headers: headers });
        }
    }
}