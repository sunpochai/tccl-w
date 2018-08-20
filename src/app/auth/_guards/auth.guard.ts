import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from 'rxjs/Rx';
import { User } from "../_models";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _authenService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        var profile: User = JSON.parse(localStorage.getItem('currentUser'));

        if (profile == null) {

            this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        return this._authenService.verify().map(data => {
            console.log("verify >> pass");
            return true;
        }).catch(e => {
            console.log("verify >> catch");
            if (e.status != null && e.status == '401') {
                console.log("verify >> 401");
                localStorage.removeItem('currentUser');
                this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
            return Observable.of(e);
        });

    }
}