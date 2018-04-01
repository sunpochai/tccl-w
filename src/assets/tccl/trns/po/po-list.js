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
        pageSize: 10,
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
          sortable: 'desc',
          template: function(row) {
            return toDisplayDate(row.po_date);
          }
        }, {   
          field: 'doc_type',
          title: 'Doc Type',
          sortable: true,
          textAlign: 'center',
        } , {
          field: 'grand_total',
          title: 'Total',
          type: 'number',
          textAlign: 'right',
          sortable: true,
          template: function (row) {
            var parts = (row.grand_total).toFixed(2).split(".");
            // alert(parts);
            var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ".00");
            return num;
          }

        } , {
          field: 'comp_name',
          title: 'Company',
          sortable: true,
          template: function (row) {
            return row.comp_code + ' - ' + row.comp_name;
          }
        } , {
          field: 'subject',
          title: 'Subject',
          sortable: true,
        } , {
          field: 'vendor_code',
          title: 'Vendor',
          sortable: true,
          template: function (row) {
            return row.vendor_code + ' - ' + row.vendor_name;
          }
        } , {
          field: 'plant_name',
          title: 'Plant',
          sortable: true,
          template: function (row) {
            return row.plant_code + ' - ' + row.plant_name;
          }
        } , {
          field: 'c_doc_status',
          title: 'Status',
          sortable: true,
          template: function (row) {
            if (row.c_doc_status != null && row.c_doc_status!='') {
              return '<span class="' + my.docStatus[row.c_doc_status].displayclass + '">' + my.docStatus[row.c_doc_status].name + '</span>';
            } else {
              return '<span class="' + my.docStatus[0].displayclass + '">' + my.docStatus[0].name + '</span>';
            }
          }
        } , {
          field: 'purchasing_group',
          title: 'Purchasing Group',
          sortable: true,
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
    query.subject = $('#m_form_subject').val();
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

function navigate_edit(poId){
  my.namespace.navigate_edit(poId);
}
 