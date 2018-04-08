import { DelegateDetail } from "./delegatedetail";

/* Dratf***** */
export class Delegate {
    delegate_id: number;
    ad_user: string;
    ad_username: string;
    start_date: Date;
    end_date: Date;
    remark: string;
    status: boolean;
    create_user: string;
    create_username: string;
    create_datetime: Date;
    update_user: string;
    update_username: string;
    update_datetime: Date;
    cf_delegate_users: Array<DelegateDetail>;
}  