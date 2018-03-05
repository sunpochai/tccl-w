import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_WORKFLOW_ACTION_REVIEW, API_WORKFLOW_ACTION_APPROVE, API_WORKFLOW_ACTION_REJECT } from "../../../../../app-constants";
import { WorkflowAction } from '../../_models/trns/workflowaction';

@Injectable()
export class WorkflowService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public review<T>(workflow: WorkflowAction) {

        return this.http.put(API_WORKFLOW_ACTION_REVIEW, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public approve<T>(workflow: WorkflowAction) {

        return this.http.put(API_WORKFLOW_ACTION_APPROVE, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public reject<T>(workflow: WorkflowAction) {

        return this.http.put(API_WORKFLOW_ACTION_REJECT, workflow, super.jwt())
            .map((response: Response) => <T>response.json());
    }

}