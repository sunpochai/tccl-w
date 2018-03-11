//== Class definition
 
/* var myDatatable = function( ) {
  //== Private functions
  var datatable;

  // basic demo
  var load = function(apiurl, myuser)  {
    
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
            data: JSON.stringify({ 'user': myuser }),
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
        pageSize: 20,
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

      columns: [
        {
          field: 'name',
          title: 'WORKLIST',
          selector: false,
          textAlign: 'center',
          sortable: true,
          template: function (row) {
            return '\
              <a href="javascript:navigate_edit(' + row.pr_id + ')" class="m-menu__link" title="Purchase Request Detail">\
                              '+row.pr_no+'\
                          </a>\
            ';
          }
        }, {   
          field: 'doc_no',
          title: 'Document Number',
          textAlign: 'center'
        }, {   
          field: 'doc_date',
          title: 'Document Date',
          type: 'datetime',
          format: 'dd/MM/yyyy'
        }, {   
          field: 'grand_total',
          title: 'Total',
          textAlign: 'right'
        } , {
          field: 'subject',
          title: 'Subject'
        } , {
          field: 'comp_name',
          title: 'Company',
          template: function (row) {
            return row.comp_code + ' - ' + row.comp_name;
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
        }
      ],
    });

  };

  var search = function()  {
    // var query = datatable.getDataSourceQuery();
    
    // if ($('#m_form_pr_no').val() != '' ) {
    //   query.pr_no = $('#m_form_pr_no').val();
    // }

    // datatable.setDataSourceQuery(query);
    // datatable.load();
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
}(); */

function navigate(trnsType, trnsId) {
  my.namespace.navigate(trnsType, trnsId);
}