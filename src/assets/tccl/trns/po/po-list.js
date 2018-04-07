//== Class definition
 
var myDatatable = function( ) {
  //== Private functions
  var datatable;

  // basic demo
  var load = function(apiurl)  {
    
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
          field: 'doc_type',
          title: 'Doc Type',
          sortable: true,
          textAlign: 'center',
          width: '60px',
        } , {
          field: 'po_no',
          title: 'PO No.',
          selector: false,
          textAlign: 'center',
          sortable: true,
          width: '80px',
          template: function (row) {
            return '<a href="/trns/po/detail/'+row.po_no+'"  class="m-menu__link" title="Purchase Order Detail"> ' + row.po_no + '</a>';
            /* return '\
              <a href="javascript:navigate_edit(' + row.po_id + ')" class="m-menu__link" title="Purchase Order Detail">\
                              '+row.po_no+'\
                          </a>\
            '; */
          }
        }, {   
          field: 'po_date',
          title: 'PO Date',
          sortable: 'desc',
          width: '80px',
          template: function(row) {
            return toDisplayDate(row.po_date);
          }
        }, {
          field: 'grand_total',
          title: 'Total',
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
          field: 'vendor_code',
          title: 'Vendor',
          sortable: true,
          template: function (row) {
            return row.vendor_code.replace(/^0+/, '') + ' - ' + row.vendor_name;
          }
        } , {
          field: 'tracking_no',
          title: 'Tracking Code',
          sortable: true,
        } , {
          field: 'purchasing_group',
          title: 'Purchasing Group',
          sortable: true,
          template: function (row) {
            return row.purchasing_group + (row.purchasing_groupname==null ? '' : ' '+row.purchasing_groupname);
          }
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
              // return '<span class="' + my.docStatus[row.c_doc_status].displayclass + '">' + my.docStatus[row.c_doc_status].name + '</span>';
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
    
    query.po_no = $('#m_form_po_no').val();
    query.doc_type = $('#m_form_doc_type').val();
    query.po_date_from = toInternalDate($('#m_form_date_from').val());
    query.po_date_to = toInternalDate($('#m_form_date_to').val());
    query.comp_code = $('#m_form_company').val();
    // query.subject = $('#m_form_subject').val();
    query.vendor_code = $('#m_form_vendor').val();
    query.plant_code = $('#m_form_plant').val();
    query.c_doc_status = $('#m_form_status').val();

    datatable.setDataSourceQuery(query);
    datatable.load();
  };

  return {
    // public functions
    init: function(apiurl) {
      load(apiurl);
    },
    search: function() {
      search();
    }
  };
}();
/* 
function navigate_edit(poId){
  my.namespace.navigate_edit(poId);
} */
 