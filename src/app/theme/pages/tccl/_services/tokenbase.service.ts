import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

export class TokenBaseService {

    constructor() {

    }

    protected getToken() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser.token) {

            return currentUser.token;
  
        }
    }
    protected jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser.token) {
            let headers = new Headers();

            headers.set('Content-Type', 'application/json');
            headers.set('Authorization', 'Bearer ' + currentUser.token);

            //  );
            //  headers.set('Content-Type', 'application/jsosn')
            //console.log(headers);
            return new RequestOptions({ headers: headers });
        }
    }
}