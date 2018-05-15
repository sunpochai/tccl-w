//== Class definition
 
var myDatatable = function( ) {
  //== Private functions
  var datatable;

  // basic demo
  var load = function(apiurl,callback)  {
    
    datatable = $('.m_datatable').mDatatable({ 
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
      
      // oSearch: {"currency": "THB"},

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
          field: 'doc_type',
          title: 'Doc Type',
          sortable: true,
          textAlign: 'center',
          width: '60px',
        } , {   
          field: 'hasAttachment',
          title: 'Att.File',
          sortable: true,
          textAlign: 'center',
          width: '60px',
          template: function (row) {
            if (row.hasAttachment == true) {
              return '<i class="flaticon-tool-1"></i>';
            } else {
              return '';
            }
          }
        } , {
          field: 'pr_no',
          title: 'PR No.',
          selector: false,
          textAlign: 'center',
          sortable: true,
          width: '80px',
          template: function (row) {
            //<a target="_blank" routerLink="/Page2">
            // return '<a target="_blank" routerLink="/trns/pr/detail/' + row.pr_no + '" title="Purchase Request Detail">' + row.pr_no + '</a>';
            // return '<a href="#" routerLink="/trns/pr/detail/' + row.pr_no + '" olinw title="Purchase Request Detail">' + row.pr_no + '</a>';
            return '<a href="./trns/pr/detail/' + row.pr_no + '" title="Purchase Request Detail">' + row.pr_no + '</a>';
            /* return '\
              <a href="javascript:navigate_edit(' + row.pr_id + ')" title="Purchase Request Detail">\
                              '+row.pr_no+'\
                          </a>\
            ';  */
          }
        }, {   
          field: 'pr_date',
          title: 'PR Date',
          textAlign: 'center',
          sortable: 'desc',
          width: '80px',
          template: function(row) {
            return toDisplayDate(row.pr_date);
          }  
        }, {
          field: 'grand_total',
          title: 'Est. Price',
          type: 'number',
          textAlign: 'right',
          sortable: true,
          width: '80px',
          template: function (row) {
            var parts = (row.grand_total).toFixed(2).split(".");
            // alert(parts);
            var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ".00");
            return num;
          }
        } , {
          field: 'currency',
          title: 'Currency',
          sortable: true,
          textAlign: 'center',
          width: '60px',
        } , {
          field: 'plant_name',
          title: 'Plant',
          sortable: true,
          template: function (row) {
            return row.plant_code + ' ' + row.plant_name;
          }
        } , {
          field: 'subject',
          title: 'Subject',
          sortable: true,
          width: '150px',
        } , {
          field: 'tracking_no',
          title: 'Tracking Code',
          sortable: true,
        } , {
          field: 'create_username',
          title: 'Requisitioner',
          sortable: true,
        } , {
          field: 'cur_resp_user',
          title: 'Current Responsible',
          sortable: true,
        } , {
          field: 'c_doc_status',
          title: 'Status',
          sortable: true,
          template: function (row) {
            if (row.c_doc_status != null && row.c_doc_status!='') {
              // return '<span class="m-badge m-badge--info m-badge--fullwidth">' + my.docStatus[row.c_doc_status].name + '</span>';
              return '<span class="' + my.docStatus[row.c_doc_status].displayListClass + '">' + my.docStatus[row.c_doc_status].name + '</span>';
            } else {
              return '<span class="' + my.docStatus[0].displayListClass + '">' + my.docStatus[0].name + '</span>';
            }
          }
        }/*  , {
          field: 'create_datetime',
          title: 'Create Date',
          template: function(row) {
            return      toDisplayDate(row.create_datetime);
          }
        } */
      ],
    });

    // datepicker
    $('#m_form_date_from').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      },
    });

    $('#m_form_date_to').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    callback();
  };

  var search = function()  {
    // alert('search');
    var query = datatable.getDataSourceQuery();
    
    query.pr_no = $('#m_form_pr_no').val();
    query.doc_type = $('#m_form_doc_type').val();
    query.pr_date_from = toInternalDate($('#m_form_date_from').val());
    query.pr_date_to = toInternalDate($('#m_form_date_to').val());
    query.comp_code = $('#m_form_company').val();
    // query.subject = $('#m_form_subject').val();
    query.plant_code = $('#m_form_plant').val();

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
      if ( document.getElementById("chkStatusRejected").checked ) {
        // alert(4);
        mystatus[mystatus.length] = 4;
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
    // This portlet is lazy initialized using data-portlet="true" attribute. You can access to the portlet object as shown below and override its behavior
    var portlet = $('#m_portlet_search').mPortlet();

    //== Toggle event handlers
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
/* 
function navigate_edit(prId){
  my.namespace.navigate_edit(prId);
} */

 