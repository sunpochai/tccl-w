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
          field: 'ad_user',
          title: 'Owner Ad User',
          sortable: 'asc'
        }, {
          field: 'ad_username',
          title: 'Owner Ad Username',
          selector: false,
        }, {
          field: 'start_date',
          title: 'Start Date',
          textAlign: 'center',
          sortable: 'desc',
          width: '80px',
          template: function(row) {
            return toDisplayDate(row.start_date);
          }  
        }, {
          field: 'end_date',
          title: 'End Date',
          textAlign: 'center',
          sortable: 'desc',
          width: '80px',
          template: function(row) {
            return toDisplayDate(row.end_date);
          }  
        }, {
          field: 'remark',
          title: 'Remark',
        },
        {
          field: 'Actions',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          textAlign: 'center',
          template: function (row, index, datatable) {
            return '\<a   href="javascript:navigate_edit(\''+ row.delegate_id +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit">\
              <i class="la la-edit"></i>\
            </a>\
            <a href="#" onclick="prepare_del(\''+ row.delegate_id +'\', \'' + row.ad_user + '\'); " data-toggle="modal" data-target="#m_modal_confirm" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
              <i class="la la-trash"></i>\
            </a>\
          	';
          }
        }  
      ],
    });

    // datepicker
    $('#dateFrom').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      },
    });

    $('#dateTo').datepicker({
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

    query.start_date = toInternalDate($('#dateFrom').val());
    query.end_date = toInternalDate($('#dateTo').val());

    query.ad_username = toInternalDate($('#txtOwnerSelected').val());
    //searchowner

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