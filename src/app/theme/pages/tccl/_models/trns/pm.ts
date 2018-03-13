import { PMItem } from "./pmitem";
import { Attachment } from "./attachment";
import { WorkflowStage } from "./workflowstage";

export class PM {
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
    pm_items: Array<PMItem>;
    attachments: Array<Attachment>;
    workflow_stages: Array<WorkflowStage>;
}
