import { ADUser } from "../masters/aduser";

export class WorkflowAction {
    workflow_id: number;
    wf_stage_resp_id: number;
    actor_user: string;
    actor_username: string;
    outcome: string;
    outcome_description: string;
    user_list : Array<ADUser>;
}
