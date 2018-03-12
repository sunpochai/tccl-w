import { Injectable } from "@angular/core";
import { Http,Headers, RequestOptions } from '@angular/http';
import "rxjs/add/operator/map";
import { API_AUTHEN_TOKEN, API_AUTHEN_CHECKIN } from "../../app-constants";

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {
    }

    login(username,password) {
        let headers = new Headers();
           headers.set('Content-Type', 'application/x-www-form-urlencoded');
               let opt = new RequestOptions({ headers: headers }); 
        
        return this.http.post(API_AUTHEN_TOKEN, "username=" + username + "&password=" + password +"&grant_type=password" , opt)
        .map(response => response.json());
           /*  .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }); */
    }
    checkin(token,username,playerid,platform)   {
        // 
        let headers = new Headers();
            headers.set('Content-Type', 'application/json');
            headers.set('Authorization', 'Bearer ' + token);
         

        let opt = new RequestOptions({ headers: headers });

        return this.http.post(API_AUTHEN_CHECKIN, JSON.stringify({ userlogin: username,playerid:playerid,platform:platform}), opt) 
        .map(response => response.json());
  }
  
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}