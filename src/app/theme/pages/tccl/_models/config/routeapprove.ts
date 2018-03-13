import { RouteApproveDetail } from "./routeapprovedetail";

export class RouteApprove {
    ms_doctype?: any;
    route_id: number;
    route_name: string;
    doc_group: number;
    doc_type: string;
    account: string;
    tracking_no: string;
    price_over_pr_flag: string;
    minimum_value: number;
    maximum_value: number;
    route_status: boolean;
    create_user: string;
    create_username: string;
    create_datetime: Date;
    update_user: string;
    update_username: string;
    update_datetime: Date;
    cf_route_detail: Array<RouteApproveDetail>;
}  