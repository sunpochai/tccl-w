//== Class definition
 
var myDatatable = function( ) {
  //== Private functions

  // basic demo
  var load = function(apiurl)  {
    
    // var dataJSONArray = JSON.parse('[{"RecordID":1,"po_no":"PO100000528","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB88,500","company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าหมึกพิมพ์ HP สำหรับเครื่องพิมพ์แผนกการเงิน"},{"RecordID":2,"po_no":"PO100000553","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":2,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB6,800" ,"company":"8017 - บจก.สินทรัพย์","Vendor":"1001022 สินทรัพย์1","Subject":"ค่าอุปกรณ์เครื่องเขียนสำนักงาน"},{"RecordID":3,"po_no":"PO100000566","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":3,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB3,200" ,"company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าซ่อมเครื่องถ่ายเอกสาร"},{"RecordID":4,"po_no":"PO100001416","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB126,500","company":"8211 - บจก.จัดการสินทรัพย์","Vendor":"1000881 บจก.ฟีนิกซ์","Subject":"ค่ากระดาษบันทึกรายการ"}]');

    var datatable = $('.m_datatable').mDatatable({
      // datasource definition
      data: {  
        saveState:false,
        type: 'remote',
        source: {
          read: {
            // sample GET method
            method: 'POST',
            url: apiurl,
            map: function(raw) {
              // sample data mapping
              var dataSet = raw;
              if (typeof raw.data !== 'undefined') {
                dataSet = raw.data;
              }
              return dataSet;
            },
          },
        },
        pageSize: 10,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true
      },

      // layout definition
      layout: {
        theme: "default",
        // class: '', // custom wrapper class
        scroll: false,
        footer: false,
      },

      sortable: true,
      pagination: true,
      toolbar: {
        // toolbar items
        items: {
          pagination: {
            pageSizeSelect: [5,10, 20, 30, 50, 100],
          },
        },
      },
 
      search: {
        input: $('#generalSearch'),
      },

      // columns definition
      // columns: [{
			// 	field: "RecordID",
			// 	title: "#",
			// 	width: 50,
			// 	sortable: false,
			// 	selector: false,
			// 	textAlign: 'center'
			// }, {
			// 	field: "Company",
			// 	title: "Company",
			// 	template: function (row) {
			// 		return '\
			// 			<a href="/pmdetail" class="m-menu__link" title="Edit ">\
      //                       '+row.Company+'\
      //                   </a>\
			// 		';
			// 	}
			// }, {
			// 	field: "Department",
			// 	title: "Department",
			// 	responsive: {visible: 'lg'},
			// 	width: 100
			// }, {
			// 	field: "Vendor",
			// 	title: "Vendor",
			// 	width: 100
			// }, {
			// 	field: "Subject",
			// 	title: "Subject"
			// }, {
			// 	field: "PONumber",
			// 	title: "PO No."
			// }, {
			// 	field: "PO Date",
			// 	title: "PO Date"
			// }, {
			// 	field: "RecStatus",
			// 	title: "Status",
			// 	template: function (row) {
			// 		var status = {
			// 			1: {'title': 'WaitReview', 'class': 'm-badge--danger'},
			// 			2: {'title': 'WaitApprove', 'class': ' m-badge--warning'},
			// 			3: {'title': 'Approved', 'class': ' m-badge--primary'}
			// 		};
			// 		return '<span class="m-badge ' + status[row.RecStatus].class + ' m-badge--wide">' + status[row.RecStatus].title + '</span>';
			// 	}
      // }]
      
      //--comment -->>>
      columns: [
        {
          field: 'pr_no',
          title: 'PR No.',
          selector: false,
          // textAlign: 'center',
          sortable: true
        /* }, {   
          field: 'pr_date',
          title: 'PR Date' */
        }, {   
          field: 'doc_type',
          title: 'Doc Type',
          // textAlign: 'center'
        } , {
          field: 'amount',
          title: 'Est. Price'
        } , {
          field: 'comp_name',
          title: 'Company'/* ,
          template: function(row) {
            return row.comp_code + '-' + row.comp_name; 
          } */
        } , {
          field: 'subject',
          title: 'Subject' 
        } , {
          field: 'plant_name',
          title: 'Plant' ,
          template: function(row) {
            return row.plant_code + '-' + row.plant_name; 
          }
        /* } , {
          field: 'c_doc_status',
          title: 'Status',
          // callback function support for column rendering
          template: function(row) {
            var status = {
              1: {'title': 'Wait Review','class': 'm-badge--danger'},
              2: {'title': 'Reviewed','class': 'm-badge--warning'},
              3: {'title': 'Approved','class': 'm-badge--primary'},
              4: {'title': 'Rejected','class': 'm-badge--metal'}
            };
            return '<span class="m-badge ' + status[row.status].class + ' m-badge--wide">' + status[row.status].title + '</span>';
          }, */
        } , {
          field: 'create_username',
          title: 'Requisitioner' 
        /* } , {
          field: 'xxx',
          title: 'Start Date' 
        } , {
          field: 'xxx',
          title: 'Due Date'  */
        // } , {
        //   field: 'create_datetime',
        //   title: 'Create Date',
        //   type: 'datetime',
        //   format: 'MM/DD/YYYY'
        //   //template: "{{update_datetime | date:'dd/MM/yyyy HH:mm:ss'}}"
        } , {
          field: 'Actions',
          // width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row, index, datatable) {
              
            //var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
            return '\<a   href="javascript:navigate_edit(\''+ row.pr_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Review">\
              <i class="flaticon-search"></i>\
            </a>\
            <a   href="javascript:navigate_edit(\''+ row.pr_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Approve">\
              <i class="flaticon-interface"></i>\
            </a>\
          	';
          }
        }

      ],
    });

    // $('#m_form_status').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'Status');
    // });

    // $('#m_form_type').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'Type');
    // });

    // $('#m_form_status, #m_form_type').selectpicker();

  };

  return {
    // public functions
    init: function(apiurl) {
      load(apiurl );
    // },reload: function(apiurl) {
    //   $('.m_datatable').mDatatable('reload');
    } 
  };
}();

// jQuery(document).ready(function() {
//   myDatatable.init('');
// });
// function selectdel(docTypeCode){
//   $('#docTypeCodeDeleteSelected').val(docTypeCode);
// } 
 
function navigate_edit(x){
  my.namespace.navigate_edit(x);
}