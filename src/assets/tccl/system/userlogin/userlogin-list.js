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
          field: 'userlogin',
          title: 'User Login',
          sortable: true,
          // width: '60px',
        } , {
          field: 'playerid',
          title: 'Player Id',
          sortable: true,
          // width: '80px',
        }, {   
          field: 'platform',
          title: 'Platform',
          sortable: true,
          // width: '80px',
        } , {
          field: 'register_date',
          title: 'Registered Date',
          sortable: true,
          textAlign: 'center',
          // width: '65px',
          template: function(row) {
            return toDisplayDateTime(row.register_date);
          }  
        } , {
          field: 'last_checkin_date',
          title: 'Last Checkin Date',
          sortable: 'desc',
          textAlign: 'center',
          // width: '65px',
          template: function(row) {
            return toDisplayDateTime(row.last_checkin_date);
          }  
        }
      ],
    });

    $('#register_date_from').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    $('#register_date_to').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    $('#last_checkin_date_from').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });

    $('#last_checkin_date_to').datepicker({
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
    
    query.register_date_from = toInternalDate($('#register_date_from').val());
    query.register_date_to = toInternalDate($('#register_date_to').val());
    query.last_checkin_date_from = toInternalDate($('#last_checkin_date_from').val());
    query.last_checkin_date_to = toInternalDate($('#last_checkin_date_to').val());
    query.generalSearch = $('#m_form_general_search').val();

    datatable.setDataSourceQuery(query);
    datatable.load();
  };

  var initial = function(apiurl)  {
    load(apiurl);

  };

  return {
    // public functions
    init: function(apiurl) {
      initial(apiurl);
    },
    search: function() {
      search();
    },
  };
}();
