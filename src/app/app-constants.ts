//Service URL
//export const API_BASE_URL: string = 'http://202.60.207.137/WebRESTApi'
<<<<<<< HEAD
//export const API_BASE_URL: string = 'http://sunpochai.thddns.net:5555'
export const API_BASE_URL: string = 'http://192.168.1.99:5555'
=======
export const API_BASE_URL: string = 'http://sunpochai.thddns.net:5555'
// export const API_BASE_URL: string = 'http://192.168.1.99:5555'
>>>>>>> 96c54dc8cef228d5e40a9f9b85ff4b10a13f6a42
export const API_AUTHEN_TOKEN: string = API_BASE_URL + '/token'
export const API_AUTHEN_CHECKIN: string = API_BASE_URL + '/api/authen/checkin'
export const API_AUTHEN_VERIFY: string = API_BASE_URL + '/api/authen/verify'
     
export const API_COMPANY_GETALL: string = API_BASE_URL + '/api/company/getall' //list all item (use with dropdown)
export const API_COMPANY_LIST: string = API_BASE_URL + '/api/company/list' //search item (use with search page)
export const API_COMPANY_GET: string = API_BASE_URL + '/api/company'
export const API_COMPANY_PUT: string = API_BASE_URL + '/api/company'
export const API_COMPANY_DEL: string = API_BASE_URL + '/api/company'
export const API_COMPANY_INSERT: string = API_BASE_URL + '/api/company/insert'
    
export const API_DOCTYPE_GETALL: string = API_BASE_URL + '/api/doctype/getall' //list all item (use with dropdown)
export const API_DOCTYPE_LIST: string = API_BASE_URL + '/api/doctype/list' //search item (use with search page)
export const API_DOCTYPE_GET_PUT_DEL: string = API_BASE_URL + '/api/doctype'
export const API_DOCTYPE_INSERT: string = API_BASE_URL + '/api/doctype/insert'

export const API_PLANT_GETALL: string = API_BASE_URL + '/api/plant/getall' //list all item (use with dropdown)
export const API_PLANT_LIST: string = API_BASE_URL + '/api/plant/list'
export const API_PLANT_GET_PUT_DEL: string = API_BASE_URL + '/api/plant'
export const API_PLANT_INSERT: string = API_BASE_URL + '/api/plant/insert'

export const API_TRACKING_GETALL: string = API_BASE_URL + '/api/tracking/getall' //list all item (use with dropdown)
export const API_TRACKING_LIST: string = API_BASE_URL + '/api/tracking/list'
export const API_TRACKING_SEARCH: string = API_BASE_URL + '/api/tracking/list2'
export const API_TRACKING_GET_PUT_DEL: string = API_BASE_URL + '/api/tracking'
export const API_TRACKING_INSERT: string = API_BASE_URL + '/api/tracking/insert'

export const API_ROUTE_PR_LIST: string = API_BASE_URL + '/api/route/prlist'
export const API_ROUTE_PO_LIST: string = API_BASE_URL + '/api/route/polist'
export const API_ROUTE_PA_LIST: string = API_BASE_URL + '/api/route/palist'
export const API_ROUTE_GET_PUT_DEL: string = API_BASE_URL + '/api/route'
export const API_ROUTE_INSERT: string = API_BASE_URL + '/api/route/insert'

export const API_REVIEWER_LIST: string = API_BASE_URL + '/api/reviewer/list'
export const API_REVIEWER_SEARCH: string = API_BASE_URL + '/api/reviewer/list2'
export const API_REVIEWER_GET_PUT_DEL: string = API_BASE_URL + '/api/reviewer'
export const API_REVIEWER_INSERT: string = API_BASE_URL + '/api/reviewer/insert'

export const API_WORKFLOW_ACTION_REVIEW: string = API_BASE_URL + '/api/worklist/review'
export const API_WORKFLOW_ACTION_APPROVE: string = API_BASE_URL + '/api/worklist/approve'
export const API_WORKFLOW_ACTION_REJECT: string = API_BASE_URL + '/api/worklist/reject'
export const API_WORKFLOW_ACTION_COMMENT: string = API_BASE_URL + '/api/worklist/comment'
export const API_WORKFLOW_ACTION_WAITING: string = API_BASE_URL + '/api/worklist/waiting'
export const API_WORKFLOW_ACTION_DELEGATE: string = API_BASE_URL + '/api/worklist/delegate'

export const API_WORKLIST: string = API_BASE_URL + '/api/worklist/my'

export const API_PR_LIST: string = API_BASE_URL + '/api/pr/list'
export const API_PR_GET: string = API_BASE_URL + '/api/pr'
export const API_PR_GET_PR_ITEM: string = API_BASE_URL + '/api/pr/getpritem'

export const API_PO_LIST: string = API_BASE_URL + '/api/po/list'
export const API_PO_GET: string = API_BASE_URL + '/api/po'

export const API_PAYMENT_LIST: string = API_BASE_URL + '/api/payment/list'
export const API_PAYMENT_GET: string = API_BASE_URL + '/api/payment'

export const API_ATTACHMENT_GET_DEL: string = API_BASE_URL + '/api/attachment'
export const API_ATTACHMENT_UPLOAD: string = API_BASE_URL + '/api/attachment/uploadfile'
 
export const API_USER_LIST: string = API_BASE_URL + '/api/users/list'

//Model status code
export const ROUTE_PR: any = { "name": "pr", "doc_group": 1 }
export const ROUTE_PO: any = { "name": "po", "doc_group": 2 }
export const ROUTE_PA: any = { "name": "pa", "doc_group": 3 }

export const C_ACCOUNT_TYPE_ACCOUNT_NAME: string = 'Account';
export const C_ACCOUNT_TYPE_NON_ACCOUNT_NAME: string = 'Non-Account';

export const ATTACHMENT_DOC_GROUP_PR: number = 1
export const ATTACHMENT_DOC_GROUP_PO: number = 2
export const ATTACHMENT_DOC_GROUP_PM: number = 3

export const WORKFLOW_STATUS_ACTIVE: number = 1
export const WORKFLOW_STATUS_COMPLETED: number = 2
export const WORKFLOW_STATUS_EXPIRED: number = 3

export const C_DOC_STATUS_WAIT_REVIEW: number = 1
export const C_DOC_STATUS_REVIEWED: number = 2
export const C_DOC_STATUS_APPROVED: number = 3
export const C_DOC_STATUS_REJECTED: number = 4
export const C_DOC_STATUS_CANCELLED: number = 9

export const C_DOC_STATUS_WAIT_REVIEW_NAME: string = 'Wait Review';
export const C_DOC_STATUS_WAIT_APPROVE_NAME: string = 'Wait Approve';
export const C_DOC_STATUS_APPROVED_NAME: string = 'Approved';
export const C_DOC_STATUS_REJECTED_NAME: string = 'Rejected';
export const C_DOC_STATUS_CANCELLED_NAME: string = 'Cancelled';

export const C_DOC_STATUS_WAIT_REVIEW_COLOR: string = 'warning';
export const C_DOC_STATUS_WAIT_APPROVE_COLOR: string = 'info';
export const C_DOC_STATUS_APPROVED_COLOR: string = 'success';
export const C_DOC_STATUS_REJECTED_COLOR: string = 'danger';
export const C_DOC_STATUS_CANCELLED_COLOR: string = 'danger';

export const C_DOC_STATUS_WAIT_REVIEW_CLASS: string = 'm-badge m-badge--' + C_DOC_STATUS_WAIT_REVIEW_COLOR + ' m-badge--wide';
export const C_DOC_STATUS_WAIT_APPROVE_CLASS: string = 'm-badge m-badge--' + C_DOC_STATUS_WAIT_APPROVE_COLOR + ' m-badge--wide';
export const C_DOC_STATUS_APPROVED_CLASS: string = 'm-badge m-badge--' + C_DOC_STATUS_APPROVED_COLOR + ' m-badge--wide';
export const C_DOC_STATUS_REJECTED_CLASS: string = 'm-badge m-badge--' + C_DOC_STATUS_REJECTED_COLOR + ' m-badge--wide';
export const C_DOC_STATUS_CANCELLED_CLASS: string = 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--wide';

export const C_DOC_STATUS_2: Array<any> = [
    { code: 0, active: false, name: "n/a", color: C_DOC_STATUS_CANCELLED_COLOR, displayclass: C_DOC_STATUS_CANCELLED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--fullwidth' },
    { code: 1, active: true, name: C_DOC_STATUS_WAIT_REVIEW_NAME, color: C_DOC_STATUS_WAIT_REVIEW_COLOR, displayclass: C_DOC_STATUS_WAIT_REVIEW_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_WAIT_REVIEW_COLOR + ' m-badge--fullwidth' },
    { code: 2, active: true, name: C_DOC_STATUS_WAIT_APPROVE_NAME, color: C_DOC_STATUS_WAIT_APPROVE_COLOR, displayclass: C_DOC_STATUS_WAIT_APPROVE_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_WAIT_APPROVE_COLOR + ' m-badge--fullwidth' },
    { code: 3, active: true, name: C_DOC_STATUS_APPROVED_NAME, color: C_DOC_STATUS_APPROVED_COLOR, displayclass: C_DOC_STATUS_APPROVED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_APPROVED_COLOR + ' m-badge--fullwidth' },
    { code: 4, active: true, name: C_DOC_STATUS_REJECTED_NAME, color: C_DOC_STATUS_REJECTED_COLOR, displayclass: C_DOC_STATUS_REJECTED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_REJECTED_COLOR + ' m-badge--fullwidth' },
    { code: 5, active: false, name: "n/a", color: C_DOC_STATUS_CANCELLED_COLOR, displayclass: C_DOC_STATUS_CANCELLED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--fullwidth' },
    { code: 6, active: false, name: "n/a", color: C_DOC_STATUS_CANCELLED_COLOR, displayclass: C_DOC_STATUS_CANCELLED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--fullwidth' },
    { code: 7, active: false, name: "n/a", color: C_DOC_STATUS_CANCELLED_COLOR, displayclass: C_DOC_STATUS_CANCELLED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--fullwidth' },
    { code: 8, active: false, name: "n/a", color: C_DOC_STATUS_CANCELLED_COLOR, displayclass: C_DOC_STATUS_CANCELLED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--fullwidth' },
    { code: 9, active: true, name: C_DOC_STATUS_CANCELLED_NAME, color: C_DOC_STATUS_CANCELLED_COLOR, displayclass: C_DOC_STATUS_CANCELLED_CLASS, displayListClass: 'm-badge m-badge--' + C_DOC_STATUS_CANCELLED_COLOR + ' m-badge--fullwidth' }
];

export const ACTION_NAME: any = {
    pending: "Pending"
    , reviewed: "Reviewed"
    , approved: C_DOC_STATUS_APPROVED_NAME
    , rejected: C_DOC_STATUS_REJECTED_NAME
    , cancelled: C_DOC_STATUS_CANCELLED_NAME
    , waiting: "Waiting"
    , commented: "Comment"
    , delegated: "Delegate"
};

export const CATEGORY_CODE: any = {
    asset: 'A'
    , expense: 'E'
    , stock: 'S'
    , projecttcl: 'P'
}

export const CATEGORY_NAME: any = {
    asset: 'Asset'
    , expense: 'Expense'
    , stock: 'Stock'
    , projecttcl: 'Projectcl'
}
