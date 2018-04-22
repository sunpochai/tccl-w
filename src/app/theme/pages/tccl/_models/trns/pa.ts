import { Attachment } from './attachment';
import { Workflow } from './workflow';
import { PAItem } from './paitem';

export class PA {
    payment_id: number;
    workflow_id: number;
    matdoc_no: string;
    doc_year: string;
    status: string;
    comp_code: string;
    comp_name: string;
    plant_code: string;
    plant_name: string;
    po_no: string;
    c_doc_status: number;
    cur_resp_user: string;
    cur_resp_username: string;
    subject: string;
    vendor_code: string;
    vendor_name: string;
    entry_date: string;
    entry_time: string;
    change_date: string;
    header_text: string;
    bu: string;
    doc_type: string;
    doc_date: string;
    post_date: string;
    create_user: string;
    reference_doc: string;
    amount: number;
    currency: string;
    tcode: string;
    tracking_no: string;
    goods_recipient: string;
    reason_line1: string;
    reason_line2: string;
    reason_line3: string;
    reason_line4: string;
    interface_datetime: string;
    upload_status: string;
    upload_message: string;
    upload_datetime: string;
    no_last_appover: string;
    wf_workflow: any;

    pa_items: Array<PAItem>;
    pa_attachment_items: Array<Attachment>;
    worklist: Workflow;
}  