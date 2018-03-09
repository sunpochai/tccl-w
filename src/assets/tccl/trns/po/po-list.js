//== Class definition
 
var myDatatable = function( ) {
  //== Private functions
  var datatable;

  // basic demo
  var load = function(apiurl)  {
    
    // var dataJSONArray = JSON.parse('[{"RecordID":1,"po_no":"PO100000528","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB88,500","company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าหมึกพิมพ์ HP สำหรับเครื่องพิมพ์แผนกการเงิน"},{"RecordID":2,"po_no":"PO100000553","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":2,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB6,800" ,"company":"8017 - บจก.สินทรัพย์","Vendor":"1001022 สินทรัพย์1","Subject":"ค่าอุปกรณ์เครื่องเขียนสำนักงาน"},{"RecordID":3,"po_no":"PO100000566","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":3,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB3,200" ,"company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าซ่อมเครื่องถ่ายเอกสาร"},{"RecordID":4,"po_no":"PO100001416","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB126,500","company":"8211 - บจก.จัดการสินทรัพย์","Vendor":"1000881 บจก.ฟีนิกซ์","Subject":"ค่ากระดาษบันทึกรายการ"}]');

    datatable = $('.m_datatable').mDatatable({
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
        serverSorting: true,
      },

      // layout definition
      layout: {
        scroll: false,
        footer: false,
        theme: "default"
      },

      // column sorting
      sortable: true,

      pagination: true,

      toolbar: {
        // toolbar items
        items: {
          // pagination
          pagination: {
            // page size select
            pageSizeSelect: [5,10, 20, 30, 50, 100],
          },
        },
      },
 
      search: {
        input: $('#generalSearch'),
      },

      columns: [
        {
          field: 'po_no',
          title: 'PO No.',
          selector: false,
          textAlign: 'center',
          sortable: true,
          template: function (row) {
            return '\
              <a href="javascript:navigate_edit(' + row.po_id + ')" class="m-menu__link" title="Purchase Order Detail">\
                              '+row.po_no+'\
                          </a>\
            ';
          }
        }, {   
          field: 'po_date',
          title: 'PO Date',
          type: 'datetime',
          format: 'dd/MM/yyyy'
        }, {   
          field: 'doc_type',
          title: 'Doc Type',
          textAlign: 'center'
        } , {
          field: 'amount',
          title: 'Total',
          type: 'number',
          textAlign: 'right',
          sortable: false
        } , {
          field: 'comp_name',
          title: 'Company',
          template: function (row) {
            return row.comp_code + ' - ' + row.comp_name;
          }
        } , {
          field: 'subject',
          title: 'Subject',
          template: function (row) {
            return '-';
          }
        } , {
          field: 'vendor_code',
          title: 'Vendor',
          template: function (row) {
            return row.vendor_code + ' - ' + row.vendor_name;
          }
        } , {
          field: 'plant_name',
          title: 'Plant',
          template: function (row) {
            return row.plant_code + ' - ' + row.plant_name;
          }
        } , {
          field: 'c_doc_status',
          title: 'Status',
          template: function (row) {
            return '<span class="m-badge m-badge--' + my.C_DOC_STATUS[row.c_doc_status-1][2] + ' m-badge--wide">' + my.C_DOC_STATUS[row.c_doc_status-1][1] + '</span>';
          }
        } , {
          field: 'purchasing_groupname',
          title: 'Purchasing'
        }
      ],
    });

    // $('#m_form_doc_type').on('change', function() {
    //   // shortcode to datatable.getDataSourceParam('query');
    //   var query = datatable.getDataSourceQuery();
    //   query.doc_type = $(this).val().toLowerCase();
    //   // shortcode to datatable.setDataSourceParam('query', query);
    //   datatable.setDataSourceQuery(query);
    //   datatable.load();
    // }).val(typeof query.doc_type !== 'undefined' ? query.Status : '');

    // $('#m_form_doc_type').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'doc_type');
    // });

    // $('#m_form_company').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'comp_code');
    // });

    // $('#m_form_plant').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'plant_code');
    // });

    // $('#m_form_status').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'c_doc_status');
    // });

    $('#m_form_doc_type, #m_form_company, #m_form_plant, #m_form_status').select2({
      placeholder: "All",
      allowClear: true
    });

    // datepicker
    $('#m_form_date_from').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    $('#m_form_date_to').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

  };

  var search = function()  {
    var query = datatable.getDataSourceQuery();
    
    if ($('#m_form_pr_no').val() != '' ) {
      query.pr_no = $('#m_form_pr_no').val();
    }

    if ($('#m_form_doc_type').val() != null && $('#m_form_doc_type').val() != '') {
      query.doc_type = $('#m_form_doc_type').val().toLowerCase();
    }

    if ($('#m_form_date_from').val() != '') {
      query.pr_date_from = toInternalDate($('#m_form_date_from').val());
    }

    if ($('#m_form_date_to').val() != '') {
      query.pr_date_to = toInternalDate($('#m_form_date_to').val());
    }

    if ($('#m_form_company').val() != null && $('#m_form_company').val() != '') {
      query.comp_code = $('#m_form_company').val().toLowerCase();
    }

    if ($('#m_form_subject').val() != '' ) {
      query.subject = $('#m_form_subject').val();
    }

    if ($('#m_form_plant').val() != null && $('#m_form_plant').val() != '') {
      query.plant_code = $('#m_form_plant').val().toLowerCase();
    }

    if ($('#m_form_status').val() != null && $('#m_form_status').val() != '') {
      query.c_doc_status = $('#m_form_status').val().toLowerCase();
    }

    datatable.setDataSourceQuery(query);
    datatable.load();
  };

  var clearData = function()  {
    $('#m_form_pr_no').val() == '';
    $('#m_form_doc_type').val() == '';
    $('#m_form_date_from').val() == '';
    $('#m_form_date_to').val() == '';
    $('#m_form_company').val() == '';
    $('#m_form_subject').val() == '';
    $('#m_form_plant').val() == '';
    $('#m_form_status').val() == '';
  };

  return {
    // public functions
    init: function(apiurl) {
      load(apiurl);
    },
    search: function() {
      search();
    },
    clearData: function() {
      clearData();
    }
  };
}();

function navigate_edit(prId){
  my.namespace.navigate_edit(prId);
}