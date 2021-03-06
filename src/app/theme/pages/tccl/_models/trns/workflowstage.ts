import { WorkflowStageLog } from "./workflowstagelog";

export class WorkflowStage {
    workflow_stage_id: number;
    workflow_id: number;
    status: number;
    stage_level: number;
    stage_name: string;
    destination_user: string;
    destination_username: string;
    actor_user: string;
    actor_username: string;
    outcome: string;
    outcome_description: string;
    start_datetime: Date;
    finish_datetime: Date;
    due_datetime: Date;
    warn_datetime: Date;
    is_config: boolean;
    canReassignAdd: boolean; //use in html to manage display feature only
    canReassignDelete: boolean; //use in html to manage display feature only
    stage_logs_list: Array<WorkflowStageLog>;
}
