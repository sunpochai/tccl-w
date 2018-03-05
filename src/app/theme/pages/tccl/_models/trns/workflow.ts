import { WorkflowStage } from "./workflowstage";
import { WorkflowStageResponsible } from "./workflowstageresponsible";

export class Workflow {
    workflow_id: number;
    name: string;
    folio: string;
    status: number;
    start_user: string;
    start_username: string;
    start_datetime: Date;
    finish_datetime: Date;
    c_doc_status: number;
    stage_list: Array<WorkflowStage>;
    current_responsible_list: Array<WorkflowStageResponsible>;
    current_stage: WorkflowStage;
    current_responsible:WorkflowStageResponsible;
}
