//== Class definition
 
var myDatatable = function( ) {
  //== Private functions
  var datatable;

  // basic demo
  var load = function(apiurl,callback)  {
    
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
        pageSize: 50,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
      },
      // render: $.fn.dataTable.render.number( ',', '.', 2 ),

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
            pageSizeSelect: [10, 20, 30, 50, 100],
          },
        },
      },
 
      search: {
        input: $('#generalSearch'),
      },

      columns: [
        {   
          field: 'hasAttachment',
          title: 'Att.File',
          sortable: true,
          textAlign: 'center',
          width: '50px',
          template: function (row) {
            if (row.hasAttachment == true) {
              return '<i class="flaticon-tool-1"></i>';
            } else {
              return '';
            }
          }
        } , {   
          field: 'doc_no',
          title: 'Doc. No.',
          sortable: true,
          textAlign: 'center',
          template: function (row) {
            return '<a href="./trns/npo/detail/'+row.payment_n_id+'"  class="m-menu__link" title="Non-PO Detail"> ' + row.doc_no + '</a>';
          }
        } , {   
          field: 'doc_date',
          title: 'Doc. Date',
          textAlign: 'center',
          sortable: true,
          width: '80px',
          template: function(row) {
            return toDisplayDate(row.doc_date);
          }
        } , {
          field: 'subject',
          title: 'Subject',
          selector: false,
          textAlign: 'left',
          sortable: true
        } , {
          field: 'comp_code',
          title: 'Company',
          sortable: true,
          template: function (row) {
            return row.comp_code + ' ' + row.comp_name;
          }
        } , {
          field: 'bu_code',
          title: 'Business Unit',
          sortable: true,
          template: function (row) {
            // return row.bu_code + ' ' + row.bu_name;
            return row.bu_name;
          }
        } , {
          field: 'plant_name',
          title: 'Plant',
          sortable: true,
          template: function (row) {
            return row.plant_code + ' ' + row.plant_name;
          }
        } , {
          field: 'vendor_code',
          title: 'Vendor/Payee',
          sortable: true,
          template: function (row) {
            // return row.vendor_code.replace(/^0+/, '') + ' - ' + row.vendor_name;
            return row.vendor_name;
          }
        } , {   
          field: 'afp_no',
          title: 'AFP No.',
          sortable: true,
          textAlign: 'center',
          // width: '80px',,
        } , {
          field: 'c_doc_status',
          title: 'Status',
          sortable: true,
          template: function (row) {
            if (row.c_doc_status != null && row.c_doc_status!='') {
              return '<span class="' + my.docStatus[row.c_doc_status].displayListClass + '">' + my.docStatus[row.c_doc_status].name + '</span>';
            } else {
              return '<span class="' + my.docStatus[0].displayListClass + '">' + my.docStatus[0].name + '</span>';
            }
          }
        }
      ],
    });

    // datepicker
    $('#m_form_date_from').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      orientation: "bottom left",
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    $('#m_form_date_to').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      orientation: "bottom left",
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    callback();
  };

  var search = function()  {
    var query = datatable.getDataSourceQuery();
    
    query.doc_type = '';//$('#m_form_doc_type').val();
    // query.matdoc_no = $('#m_form_pa_no').val();
    query.afp_no = $('#m_form_afp_no').val();
    query.doc_no = $('#m_form_doc_no').val();
    query.doc_date_from = toInternalDate($('#m_form_date_from').val());
    query.doc_date_to = toInternalDate($('#m_form_date_to').val());
    query.comp_code = $('#m_form_company').val();
    query.plant_code = $('#m_form_plant').val();
    query.vendor_code = $('#m_form_vendor').val();
    
    var mystatus = [];

    if ( document.getElementById("chkStatusAll").checked ) {
      //do nothing
    } else {
      if ( document.getElementById("chkStatusWaitReview").checked ) {
        // alert(1);
        mystatus[mystatus.length] = 1;
      }
      if ( document.getElementById("chkStatusWaitApprove").checked ) {
        // alert(2);
        mystatus[mystatus.length] = 2;
      }
      if ( document.getElementById("chkStatusApproved").checked ) {
        // alert(3);
        mystatus[mystatus.length] = 3;
      }
      if ( document.getElementById("chkStatusCanceled").checked ) {
        // alert(9);
        mystatus[mystatus.length] = 9;
      }
    }
    query.c_doc_status = mystatus;

    datatable.setDataSourceQuery(query);
    datatable.load();
  };

  var initToastr = function() {
    toastr.options.showDuration = 1000;
  }

  var initSearchPanel = function() {
    var portlet = $('#m_portlet_search').mPortlet();

    portlet.on('beforeCollapse', function(portlet) {
        // setTimeout(function() {
        //     toastr.info('Before collapse event fired!');
        // }, 100);
    });

    portlet.on('afterCollapse', function(portlet) {
        // setTimeout(function() {
        //     toastr.warning('Before collapse event fired!');
        // }, 2000);            
    });
  }
    
  var initial = function(apiurl)  {
    load(apiurl, function() {
     search();
    });
    initToastr();
    initSearchPanel();
  };

  return {
    // public functions
    init: function(apiurl) {
      initial(apiurl);
    },
    search: function() {
      search();
    }
  };
}();

 