import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from 'rxjs/Rx';
import { User } from "../_models";

@Injectable()
export class AuthGuardDataOwner implements CanActivate {

    constructor(private _router: Router, private _authenService:AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        var profile: User = JSON.parse(localStorage.getItem('currentUser'));
      
        if( profile.roles!=null && 
        profile.roles.length > 0 &&
        profile.roles[0] == 'ADMIN')
        {
          return true;
        }else if( 
            profile.roles!=null && 
            profile.roles.length > 0 &&
            profile.roles[0] == 'OWNER')
        {
            return true;
        }else{
            this._router.navigate(['/accessdenied'], { queryParams: { returnUrl: state.url } });
            return false;
        }
  
       
       
    }
}