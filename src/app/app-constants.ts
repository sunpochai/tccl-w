//Service URL
export const API_BASE_URL: string = 'http://sunpochai.thddns.net:5555'
export const API_COMPANY_LIST: string = API_BASE_URL + '/api/company/list'
export const API_COMPANY_GET: string = API_BASE_URL + '/api/company'
export const API_COMPANY_PUT: string = API_BASE_URL + '/api/company'
export const API_COMPANY_DEL: string = API_BASE_URL + '/api/company'
export const API_COMPANY_INSERT: string = API_BASE_URL + '/api/company/insert' 

export const API_DOCTYPE_LIST: string = API_BASE_URL + '/api/doctype/list'
export const API_DOCTYPE_GET_PUT_DEL: string = API_BASE_URL + '/api/doctype'
export const API_DOCTYPE_INSERT: string = API_BASE_URL + '/api/doctype/insert'  

export const API_TRACKING_LIST: string = API_BASE_URL + '/api/tracking/list'
export const API_TRACKING_GET_PUT_DEL: string = API_BASE_URL + '/api/tracking'
export const API_TRACKING_INSERT: string = API_BASE_URL + '/api/tracking/insert'  

export const API_PR_LIST: string = API_BASE_URL + '/api/pr/list'
export const API_PR_GET: string = API_BASE_URL + '/api/pr'

export const API_PO_LIST: string = API_BASE_URL + '/api/po/list'
export const API_PO_GET: string = API_BASE_URL + '/api/po'

export const API_PAYMENT_LIST: string = API_BASE_URL + '/api/payment/list'
export const API_PAYMENT_GET: string = API_BASE_URL + '/api/payment'

//Model status code
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

export const PR_CATEGORY_ASSET: string = 'A';
export const PR_CATEGORY_EXPENSE: string = 'E';
export const PR_CATEGORY_STOCK: string = 'S';
export const PR_CATEGORY_PROJECTTCL: string = 'P';

export const PR_CATEGORY_ASSET_NAME: string = 'Asset';
export const PR_CATEGORY_EXPENSE_NAME: string = 'Expense';
export const PR_CATEGORY_STOCK_NAME: string = 'Stock';
export const PR_CATEGORY_PROJECTTCL_NAME: string = 'Projectcl';