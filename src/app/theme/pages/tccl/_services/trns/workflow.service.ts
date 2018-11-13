import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_WORKFLOW_ACTION_REVIEW, API_WORKFLOW_ACTION_APPROVE, API_WORKFLOW_ACTION_REJECT, API_WORKFLOW_ACTION_COMMENT, API_WORKFLOW_ACTION_WAITING, API_WORKFLOW_ACTION_DELEGATE, API_PA_REASSIGN, API_NON_PO_REASSIGN } from "../../../../../app-constants";
import { WorkflowAction } from '../../_models/trns/workflowaction';
import { ADUser } from '../../_models/masters/aduser';
import { Workflow } from '../../_models/trns/workflow';

@Injectable()
export class WorkflowService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public review<T>(workflow: WorkflowAction) {

        return this.http.post(API_WORKFLOW_ACTION_REVIEW, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public approve<T>(workflow: WorkflowAction) {

        return this.http.post(API_WORKFLOW_ACTION_APPROVE, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public reject<T>(workflow: WorkflowAction) {

        return this.http.post(API_WORKFLOW_ACTION_REJECT, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public comment<T>(workflow: WorkflowAction) {

        return this.http.post(API_WORKFLOW_ACTION_COMMENT, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public waiting<T>(workflow: WorkflowAction) {

        return this.http.post(API_WORKFLOW_ACTION_WAITING, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public delegate<T>(workflow: WorkflowAction) {

        return this.http.post(API_WORKFLOW_ACTION_DELEGATE, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public reassign<T>(in_payment_id: number, in_workflow: Workflow) {

        return this.http.post(API_PA_REASSIGN, JSON.stringify({ payment_id: in_payment_id, workflow: in_workflow }), super.jwt())
            .map((response: Response) => response.json());
    }

    public reassignNpo<T>(in_payment_n_id: number, in_workflow: Workflow) {

        return this.http.post(API_NON_PO_REASSIGN, JSON.stringify({ payment_n_id: in_payment_n_id, workflow: in_workflow }), super.jwt())
            .map((response: Response) => response.json());
    }
}