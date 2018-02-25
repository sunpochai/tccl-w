import { WorkflowStage } from "./workflowstage";

export class Workflow {
    workflow_id: number;
    name: string;
    folio: string;
    status: number;
    start_user: string;
    start_username: string;
    start_datetime: Date;
    finish_datetime: Date;
    workflow_stages: Array<WorkflowStage>;
}
