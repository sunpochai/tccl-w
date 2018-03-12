//Service URL
export const API_BASE_URL: string = 'http://sunpochai.thddns.net:5555'
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

export const API_TRACKING_LIST: string = API_BASE_URL + '/api/tracking/list'
export const API_TRACKING_SEARCH: string = API_BASE_URL + '/api/tracking/list2'
export const API_TRACKING_GET_PUT_DEL: string = API_BASE_URL + '/api/tracking'
export const API_TRACKING_INSERT: string = API_BASE_URL + '/api/tracking/insert'  

export const API_ROUTE_PR_LIST: string = API_BASE_URL + '/api/route/prlist'
export const API_ROUTE_PO_LIST: string = API_BASE_URL + '/api/route/polist'
export const API_ROUTE_PA_LIST: string = API_BASE_URL + '/api/route/palist'
export const API_ROUTE_GET_PUT_DEL: string = API_BASE_URL + '/api/route'
export const API_ROUTE_INSERT: string = API_BASE_URL + '/api/route/insert'

export const API_WORKFLOW_ACTION_REVIEW: string = API_BASE_URL + '/api/worklist/review'
export const API_WORKFLOW_ACTION_APPROVE: string = API_BASE_URL + '/api/worklist/approve'
export const API_WORKFLOW_ACTION_REJECT: string = API_BASE_URL + '/api/worklist/reject'

export const API_WORKLIST: string = API_BASE_URL + '/api/worklist/my'

export const API_PR_LIST: string = API_BASE_URL + '/api/pr/list'
export const API_PR_GET: string = API_BASE_URL + '/api/pr'

export const API_PO_LIST: string = API_BASE_URL + '/api/po/list'
export const API_PO_GET: string = API_BASE_URL + '/api/po'

export const API_PAYMENT_LIST: string = API_BASE_URL + '/api/payment/list'
export const API_PAYMENT_GET: string = API_BASE_URL + '/api/payment'

export const API_ATTACHMENT_GET: string = API_BASE_URL + '/api/attachment'
export const API_ATTACHMENT_INSERT: string = API_BASE_URL + '/api/attachment'
export const API_ATTACHMENT_DEL: string = API_BASE_URL + '/api/attachment/del'

//Model status code
export const ROUTE_PR: any = {"name":"pr","doc_group":1}
export const ROUTE_PO: any = {"name":"po","doc_group":2}
export const ROUTE_PA: any = {"name":"pa","doc_group":3}

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

export const C_DOC_STATUS_WAIT_REVIEW_NAME: string = 'Wait Review';
export const C_DOC_STATUS_REVIEWED_NAME: string = 'Reviewed';
export const C_DOC_STATUS_APPROVED_NAME: string = 'Approved';
export const C_DOC_STATUS_REJECTED_NAME: string = 'Rejected';
export const C_DOC_STATUS_WAITING_NAME: string = 'Waiting';
export const C_DOC_STATUS_COMMENT_NAME: string = 'Comment';

export const C_DOC_STATUS_WAIT_REVIEW_COLOR: string = 'warning';
export const C_DOC_STATUS_REVIEWED_COLOR: string = 'info';
export const C_DOC_STATUS_APPROVED_COLOR: string = 'success';
export const C_DOC_STATUS_REJECTED_COLOR: string = 'danger';

export const C_DOC_STATUS_WAIT_REVIEW_CLASS: string = 'm-badge m-badge--'+C_DOC_STATUS_WAIT_REVIEW_COLOR+' m-badge--wide';
export const C_DOC_STATUS_REVIEWED_CLASS: string = 'm-badge m-badge--'+C_DOC_STATUS_REVIEWED_COLOR+' m-badge--wide';
export const C_DOC_STATUS_APPROVED_CLASS: string = 'm-badge m-badge--'+C_DOC_STATUS_APPROVED_COLOR+' m-badge--wide';
export const C_DOC_STATUS_REJECTED_CLASS: string = 'm-badge m-badge--'+C_DOC_STATUS_REJECTED_COLOR+' m-badge--wide';

export const C_DOC_STATUS: Array<Array<any>> = [[C_DOC_STATUS_WAIT_REVIEW,C_DOC_STATUS_WAIT_REVIEW_NAME,C_DOC_STATUS_WAIT_REVIEW_COLOR,C_DOC_STATUS_WAIT_REVIEW_CLASS]
                                                ,[C_DOC_STATUS_REVIEWED,C_DOC_STATUS_REVIEWED_NAME,C_DOC_STATUS_REVIEWED_COLOR,C_DOC_STATUS_REVIEWED_CLASS]
                                                ,[C_DOC_STATUS_APPROVED,C_DOC_STATUS_APPROVED_NAME,C_DOC_STATUS_APPROVED_COLOR,C_DOC_STATUS_APPROVED_CLASS]
                                                ,[C_DOC_STATUS_REJECTED,C_DOC_STATUS_REJECTED_NAME,C_DOC_STATUS_REJECTED_COLOR,C_DOC_STATUS_REJECTED_CLASS]
                                                ];

export const PR_CATEGORY_ASSET: string = 'A';
export const PR_CATEGORY_EXPENSE: string = 'E';
export const PR_CATEGORY_STOCK: string = 'S';
export const PR_CATEGORY_PROJECTTCL: string = 'P';

export const PR_CATEGORY_ASSET_NAME: string = 'Asset';
export const PR_CATEGORY_EXPENSE_NAME: string = 'Expense';
export const PR_CATEGORY_STOCK_NAME: string = 'Stock';
export const PR_CATEGORY_PROJECTTCL_NAME: string = 'Projectcl';