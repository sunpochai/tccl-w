import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_ATTACHMENT_DEL, API_ATTACHMENT_INSERT } from "../../../../../app-constants";
import { Attachment } from '../../_models/trns/attachment';

@Injectable()
export class AttachmentService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public del(id: string) {

        return this.http.delete(API_ATTACHMENT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }

    public insert<T>(attachment: Attachment) {

        return this.http.put(API_ATTACHMENT_INSERT, attachment, super.jwt())
            .map((response: Response) => <T>response.json());
    }

}