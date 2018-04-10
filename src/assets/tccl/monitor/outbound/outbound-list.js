//== Class definition
 
var myDatatable = function( ) {
  //== Private functions
  var datatable;

  // basic demo
  var load = function(apiurl)  {
    
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
          field: 'doc_group',
          title: 'Document Group',
          sortable: true,
          textAlign: 'center',
          width: '60px',
          template: function (row) {
            switch (row.doc_group) {
              case 1:
                return '<span class="m-badge m-badge--dot m-badge--success"></span><span  style="padding: 3px">PR</span>';
              case 2:
                return '<span class="m-badge m-badge--dot m-badge--metal"></span><span  style="padding: 3px">PO</span>';
              case 3:
                return '<span class="m-badge m-badge--dot m-badge--success"></span><span  style="padding: 3px">PA</span>';
              default:
                return 'n/a';
            }
          },
        } , {
          field: 'doc_no',
          title: 'Document No.',
          selector: false,
          textAlign: 'center',
          sortable: true,
          width: '80px',
          template: function (row) {
            if (row.doc_group == 1) {
              return '<a href="./trns/pr/detail/' + row.doc_no + '" title="Purchase Request Detail">' + row.doc_no + '</a>';
            } else if (row.doc_group == 2) {
              return '<a href="./trns/po/detail/' + row.doc_no + '" title="Purchase Order Detail">' + row.doc_no + '</a>';
            } else if (row.doc_group == 3) {
              return '<a href="./trns/pa/detail/' + row.doc_no + '" title="Purchase Approve Detail">' + row.doc_no + '</a>';
            } else {
              return row.doc_no;
            }
          }
        }, {   
          field: 'doc_date',
          title: 'Document Date',
          textAlign: 'center',
          sortable: 'desc',
          width: '80px',
          template: function(row) {
            return toDisplayDate(row.doc_date);
          }  
        }, {
          field: 'doc_type',
          title: 'Doc Type',
          textAlign: 'center',
          sortable: true,
          width: '80px',
        } , {
          field: 'upload_status',
          title: 'Upload Status',
          sortable: true,
          textAlign: 'center',
          template: function(row) {
            if (row.upload_status == 'E') {
              return '<span class="m-badge m-badge--danger m-badge--fullwidth">Error</span>';
            } else if (row.upload_status == 'M') {
              return '<span class="m-badge m-badge--info m-badge--fullwidth">Manual</span>';
            } else if (row.upload_status == 'S') {
              return '<span class="m-badge m-badge--success m-badge--fullwidth">Success</span>';
            } else {
              return '<span class="m-badge m-badge--danger m-badge--fullwidth">n/a</span>';
            }
          } 
        } , {
          field: 'upload_message',
          title: 'Upload Message',
          sortable: true,
        } , {
          field: 'upload_datetime',
          title: 'Upload Datetime',
          sortable: true,
          textAlign: 'center',
          template: function(row) {
            return toDisplayDateTime(row.upload_datetime);
          },
        } , {
          field: 'Actions',
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          textAlign: 'center',
          
          template: function (row, index, datatable) {
            if (row.upload_status == 'E') {
              return '\<a href="#" onclick="prepare_action(\'reupload\',\''+ row.doc_group +'\', \'' + row.doc_no + '\'); " data-toggle="modal" data-target="#m_modal_confirm" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Re-Upload document">\
                <i class="fa fa-upload"></i>\
              </a>\
              <a href="#" onclick="prepare_action(\'manual\',\''+ row.doc_group +'\', \'' + row.doc_no + '\'); " data-toggle="modal" data-target="#m_modal_confirm" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Manual operated">\
                <i class="fa fa-check"></i>\
              </a>\
              ';
            } else {
              return '';
            }
        }
        }  
      ],
    });

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
    
    query.doc_group = $('#m_form_doc_group').val();
    query.upload_status = $('#m_form_upload_status').val();
    query.pr_date_from = toInternalDate($('#m_form_date_from').val());
    query.pr_date_to = toInternalDate($('#m_form_date_to').val());

    datatable.setDataSourceQuery(query);
    datatable.load();
  };

  var initial = function()  {
    var query = datatable.getDataSourceQuery();
    
    query.upload_status = 'E';
    query.pr_date_from = getCurrentMonthFirstDate();
    query.pr_date_to = getCurrentMonthLastDate();

    datatable.setDataSourceQuery(query);
    datatable.load();
  };

  return {
    // public functions
    init: function(apiurl) {
      load(apiurl);
      //firstFunction(() => console.log('huzzah, I\'m done!'))
      // load((apiurl) => initial());
    },
    search: function() {
      search();
    },
  };
}();

function prepare_action(action, doc_group, doc_no) {
  my.namespace.prepare_action(action, doc_group, doc_no);
}