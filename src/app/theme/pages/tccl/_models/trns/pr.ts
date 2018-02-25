import { PRItem } from "./pritem";

export class PR {
    pr_id: number;
    workflow_id: number;
    pr_no: string;
    status: string;
    create_user: string;
    create_username: string;
    category: string;
    doc_type: string;
    plant_code: string;
    plant_name: string;
    tracking_no: string;
    account_asign_category: string;
    reason_line1: string;
    reason_line2: string;
    reason_line3: string;
    reason_line4: string;
    creat_date: string;
    comp_code: string;
    comp_name: string;
    amount: number;
    pr_items: Array<PRItem>;
}  