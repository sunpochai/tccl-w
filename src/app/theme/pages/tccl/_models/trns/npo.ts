import { Attachment } from './attachment';
import { Workflow } from './workflow';
import { NPOItem } from './npoitem';
import { NPOBudget } from './npobudget';

export class NPO {
    payment_n_id: number;

    doc_no: string;
    c_doc_status: number;
    cur_resp_user: string;
    cur_resp_username: string;
    hasAttachment: boolean;
    workflow_id: number;
    afp_no: string;
    afp_ref: string;
    doc_date: Date;
    subject: string;
    status: string;
    comp_code: string;
    comp_name: string;
    plant_code: string;
    plant_name: string;
    vendor_code: string;
    vendor_name: string;
    non_tracking_no: string;
    remark: string;
    grand_total: number;
    currency: string;
    change_date: Date;
    change_user: string;
    create_date: Date;
    create_user: string;
    create_username: string;
    print_count: number;
    print_user: string;
    advances_amt: number;
    bu_code: string;
    bu_name: string;
    wf_workflow: any;
    can_print: boolean;

    trn_payment_n_item: Array<NPOItem>;
    trn_payment_n_budget: Array<NPOBudget>;
    pa_attachment_items: Array<Attachment>;
    worklist: Workflow;
}  