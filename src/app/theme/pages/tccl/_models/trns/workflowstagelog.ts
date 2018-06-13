export class WorkflowStageLog {
    workflow_stage_log_id: number;
    workflow_stage_id: number;
    destination_user: string;
    destination_username: string;
    actor_user: string;
    actor_username: string;
    activity: string;
    activity_description: string;
    start_datetime: Date;
    finish_datetime: Date;
    canReassignAdd: boolean; //use in html to manage display feature only
    canReassignDelete: boolean; //use in html to manage display feature only
}
