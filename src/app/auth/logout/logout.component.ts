import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { Helpers } from "../../helpers";
import { PageBaseComponent } from "../../theme/pages/tccl/pagebase.component";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent extends PageBaseComponent implements OnInit {

    constructor(private _router: Router,
        private _authService: AuthenticationService) {
        super();
    }

    ngOnInit(): void {
        Helpers.setLoading(true);
        // reset login status
        this._authService.logout(this.currentUser.token, this.currentUser.ad_user);
        this._router.navigate(['/login']);
    }
}