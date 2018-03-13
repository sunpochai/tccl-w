//== Class definition
 
 
var myDatatable = function( ) {
  //== Private functions

  // basic demo
   
  var load = function( apiurl)  {
  	$('.m_datatables').mDatatable('destroy');
    var  datatable = $('.m_datatables').mDatatable({
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
        }
        ,
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
 
      /* search: {
        input: $('#generalSearch'),
      }, */

      // columns definition
      columns: [
        {
          field: 'route_name',
          title: 'Route Name',
          selector: false,
          sortable: 'asc'
        }, {
          field: 'tracking_no',
          title: 'Tracking Number',
          sortable: 'asc',
        }, {
          field: 'doc_type',
          title: 'Doc Type',
          sortable: 'asc',
        }, {
          field: 'account',
          title: 'Account / Non-account',
          sortable: 'asc',
          //A:Account   N:Non-Account
          template: function (row) {
            if (row.account=='A'){
              return 'Account';
            } else if (row.account=='N') {
              return 'Non-Account';
            } else {
              return 'N/A';
            }
          }
        },
        {
          field: 'Actions',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row, index, datatable) {
            var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
            return '\<a   href="javascript:navigate_edit(\''+ row.route_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">\
              <i class="la la-edit"></i>\
            </a>\
            <a href="#" onclick="javascript:selectdel(\''+ row.route_id +'\');return false;" data-toggle="modal" data-target="#m_modal_6" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
              <i class="la la-trash"></i>\
            </a>\
          	';
          }
        }  
      ],
    });
  };

  var search = function()  {
    var query = datatable.getDataSourceQuery();
    
    query.route_name = $('#m_form_route_name').val();
    query.doc_type = $('#m_form_doc_type').val();

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
 
function navigate_edit(id){
  my.namespace.navigate_edit(id);
}