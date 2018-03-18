//== Class definition
 
 
var myDatatable = function( ) {

  var datatable;

  var load = function( apiurl)  {
  	
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
          field: 'sap_code',
          title: 'SAP Code',
          selector: false,
          sortable: 'asc'
        }, {
          field: 'sap_group',
          title: 'SAP Group',
          sortable: 'asc',
          template: function (row) {
            if (row.sap_group=='1'){
              return 'Requisitioner';
            } else if (row.sap_group=='2') {
              return 'Purchasing Group';
            } else {
              return 'N/A';
            }
          }
        }, {
          field: 'ad_username',
          title: 'Reviewer',
          sortable: 'asc'
        }, {
          field: 'Actions',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row, index, datatable) {
            var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
            return '\<a   href="javascript:navigate_edit(\''+ row.review_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">\
              <i class="la la-edit"></i>\
            </a>\
            <a href="#" onclick="prepare_del(\''+ row.review_id +'\', \'' + row.sap_code + '\'); " data-toggle="modal" data-target="#m_modal_confirm" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
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
    },
    reload: function() {
      $('.m_datatable').mDatatable('reload');
    }
  };
}();

function navigate_edit(id){
  my.namespace.navigate_edit(id);
}

function prepare_del(id,name){
  my.namespace.prepare_del(id,name);
}