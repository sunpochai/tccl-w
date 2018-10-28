//== Class definition
 
 
var myDatatable = function( ) {

  var datatable;
   
  var load = function( apiurl)  {
  	
    datatable = $('.m_datatables').mDatatable({
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
        pageSize: 50,
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
            pageSizeSelect: [10, 20, 30, 50, 100],
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
          sortable: 'asc',
          template: function (row) {
            return '<a href="./config/route/detail/' + row.route_id + '" >' + row.route_name + '</a>';
          }
        }, {
          field: 'tracking_no',
          title: 'Tracking Number',
        /* }, {
          field: 'doc_type',
          title: 'Doc Type',
          textAlign: 'center', */
        }, {
          field: 'minimum_value',
          title: 'Minimum Value',
          type: 'number',
          textAlign: 'right',
          template: function (row) {
            var parts = (row.minimum_value).toFixed(2).split(".");
            // alert(parts);
            var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ".00");
            return num;
          }
        }, {
          field: 'maximum_value',
          title: 'Maximum Value',
          type: 'number',
          textAlign: 'right',
          template: function (row) {
            if (row.maximum_value == 9999999999999.99) {
              return 'Unlimited';
            } else {
              var parts = (row.maximum_value).toFixed(2).split(".");
              // alert(parts);
              var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ".00");
              return num;
            }
          }
        }, {
          field: 'cf_route_detail',
          title: 'Approver',
          textAlign: 'left',
          template: function (row) {
            var s = '';

            row.cf_route_detail.forEach(function(element) {
              s = s + element.ad_username + '<br>';
            });
            return s;
          }
        }, {
          field: 'Actions',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          textAlign: 'center',
          template: function (row, index, datatable) {
            return '\<a   href="javascript:navigate_edit(\''+ row.route_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">\
              <i class="la la-edit"></i>\
              </a>\
              <a href="#" onclick="prepare_del(\''+ row.route_id +'\', \'' + row.route_name + '\'); " data-toggle="modal" data-target="#m_modal_confirm" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
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
    // query.doc_type = $('#m_form_doc_type').val();
    query.tracking_no = $('#tracking_no').val();

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
      $('.m_datatables').mDatatable('reload');
    }
  };
}();
 
function navigate_edit(id){
  my.namespace.navigate_edit(id);
}

function prepare_del(id,name){
  my.namespace.prepare_del(id,name);
}