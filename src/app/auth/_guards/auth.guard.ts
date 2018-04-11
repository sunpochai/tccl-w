import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from 'rxjs/Rx';
import { User } from "../_models";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        var profile: User = JSON.parse(localStorage.getItem('currentUser'));
  
if(profile==null){

    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
}

           return this._userService.verify()
       .map(
           data => {
            
               if (data !== null) { 
                   // logged in so return true
                   return true;
               }
               // error when verify so redirect to login page with the return url
               this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
               return false;
           },
           error => {    
               // error when verify so redirect to login page with the return url
                localStorage.removeItem('currentUser');
               return false;
           }); 

           
    }
}