import { PRItem } from "./pritem";
import { Attachment } from "./attachment";
import { WorkflowStage } from "./workflowstage";
import { Workflow } from "./workflow";
import { WorkflowStageResponsible } from "./workflowstageresponsible";

export class PR {
    pr_id: number;
    // workflow_id: number;
    pr_no: string;
    pr_date: Date;
    tracking_no: string;
    subject: string;
    status: string;
    category: string;
    doc_type: string;
    plant_code: string;
    plant_name: string;
    account_asign_category: string;
    reason_line1: string;
    reason_line2: string;
    reason_line3: string;
    reason_line4: string;
    comp_code: string;
    comp_name: string;
    workflow_id: number;
    amount: number;
    currency: string;
    exchrate: number;
    create_user: string;
    create_username: string;
    create_datetime: string;
    c_doc_status: number;
    pr_items: Array<PRItem>;
    pr_attachment_items: Array<Attachment>;
    worklist: Workflow;
}  