//== Class definition
 
var myDatatable = function( ) {
  //== Private functions

  // basic demo
  var load = function( apiurl)  {
    
    // var dataJSONArray = JSON.parse('[{"RecordID":1,"po_no":"PO100000528","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB88,500","company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าหมึกพิมพ์ HP สำหรับเครื่องพิมพ์แผนกการเงิน"},{"RecordID":2,"po_no":"PO100000553","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":2,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB6,800" ,"company":"8017 - บจก.สินทรัพย์","Vendor":"1001022 สินทรัพย์1","Subject":"ค่าอุปกรณ์เครื่องเขียนสำนักงาน"},{"RecordID":3,"po_no":"PO100000566","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":3,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB3,200" ,"company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าซ่อมเครื่องถ่ายเอกสาร"},{"RecordID":4,"po_no":"PO100001416","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB126,500","company":"8211 - บจก.จัดการสินทรัพย์","Vendor":"1000881 บจก.ฟีนิกซ์","Subject":"ค่ากระดาษบันทึกรายการ"}]');

    var datatable = $('.m_datatable').mDatatable({
      // datasource definition
      /* data: {
				type: 'local',
				source: dataJSONArray,
				pageSize: 10
			}, */
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
        }
        ,
        pageSize: 10,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true
      },

      // layout definition
      layout: {
        scroll: false,
        footer: false,
        theme: "default"
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
      columns: [
        {
          field: 'pr_no',
          title: 'PR No.',
          width: 100,
          selector: false,
          textAlign: 'center',
          sortable: 'asc'
        }, {   
          field: 'pr_date',
          title: 'PR Date',
          sortable: true,
          filterable: false,
        }, {   
          field: 'doc_type',
          title: 'Doc Type',
          sortable: true,
          filterable: false,
        } , {
          field: 'amount',
          title: 'Est. Price' 
        } , {
          field: 'comp_name',
          title: 'Company' 
        } , {
          field: 'xxx',
          title: 'Subject' 
        } , {
          field: 'xxx',
          title: 'Vendor' 
        } , {
          field: 'plant_name',
          title: 'Plant' 
        }, {
          field: 'status',
          title: 'Status',
          // callback function support for column rendering
          template: function(row) {
            var status = {
              'CREATE': {'class': 'm-badge--brand'},
              'CHANGE': {'class': 'm-badge--info'},
              'RE-APP': {'class': 'm-badge--warning'},
              'DELETE': {'class': 'm-badge--danger'}
            };
            return '<span class="m-badge ' + status[row.status].class + ' m-badge--wide">' + row.status + '</span>';
          },
        } , {
          field: 'create_username',
          title: 'Requisitioner' 
        } , {
          field: 'xxx',
          title: 'Start Date' 
        } , {
          field: 'xxx',
          title: 'Due Date' 
        // } , {
        //   field: 'create_datetime',
        //   title: 'Create Date',
        //   type: 'datetime',
        //   format: 'MM/DD/YYYY'
        //   //template: "{{update_datetime | date:'dd/MM/yyyy HH:mm:ss'}}"
        } , {
          field: 'Actions',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row, index, datatable) {
              
            var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
            return '\<a   href="javascript:navigate_edit(\''+ row.pr_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Review">\
              <i class="flaticon-search"></i>\
            </a>\
            <a href="#" onclick="javascript:navigate_edit(\''+ row.pr_id +'\');return false;" data-toggle="modal" data-target="#m_modal_6" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Approve">\
              <i class="flaticon-interface"></i>\
            </a>\
          	';
          }
        }
        // }, {
        //   field: 'Status',
        //   title: 'Status',
        //   // callback function support for column rendering
        //   template: function(row) {
        //     var status = {
        //       1: {'title': 'Pending', 'class': 'm-badge--brand'},
        //       2: {'title': 'Delivered', 'class': ' m-badge--metal'},
        //       3: {'title': 'Canceled', 'class': ' m-badge--primary'},
        //       4: {'title': 'Success', 'class': ' m-badge--success'},
        //       5: {'title': 'Info', 'class': ' m-badge--info'},
        //       6: {'title': 'Danger', 'class': ' m-badge--danger'},
        //       7: {'title': 'Warning', 'class': ' m-badge--warning'},
        //     };
        //     return '<span class="m-badge ' + status[row.Status].class + ' m-badge--wide">' + status[row.Status].title + '</span>';
        //   },
        // }, {
        //   field: 'Type',
        //   title: 'Type',
        //   // callback function support for column rendering
        //   template: function(row) {
        //     var status = {
        //       1: {'title': 'Online', 'state': 'danger'},
        //       2: {'title': 'Retail', 'state': 'primary'},
        //       3: {'title': 'Direct', 'state': 'accent'},
        //     };
        //     return '<span class="m-badge m-badge--' + status[row.Type].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + status[row.Type].state + '">' +
        //         status[row.Type].title + '</span>';
        //   },
        // }, {
        //   field: 'Actions',
        //   width: 110,
        //   title: 'Actions',
        //   sortable: false,
        //   overflow: 'visible',
        //   template: function (row, index, datatable) {
        //     var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
        //     return '\
				// 		<div class="dropdown ' + dropup + '">\
				// 			<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
        //                         <i class="la la-ellipsis-h"></i>\
        //                     </a>\
				// 		  	<div class="dropdown-menu dropdown-menu-right">\
				// 		    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
				// 		    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
				// 		    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
				// 		  	</div>\
				// 		</div>\
				// 		<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
				// 			<i class="la la-edit"></i>\
				// 		</a>\
				// 		<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
				// 			<i class="la la-trash"></i>\
				// 		</a>\
				// 	';
        //   },
        // }
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
      // load(apiurl );
    },reload: function(apiurl) {
      // $('.m_datatable').mDatatable('reload');
    } 
  };
}();

//jQuery(document).ready(function() {
//  DatatableRemoteAjaxDemo.init('');
//});
function selectdel(docTypeCode){
  $('#docTypeCodeDeleteSelected').val(docTypeCode);
} 
 
function navigate_edit(x){
  my.namespace.navigate_edit(x);
}