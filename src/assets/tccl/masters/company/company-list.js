//== Class definition
 
 
var myDatatable_company = function( ) {
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
        }//'http://192.168.1.99:8090/api/company/list'
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
 
      search: {
        input: $('#generalSearch'),
      },

      // columns definition
      columns: [
        {
          field: 'comp_code',
          title: 'Company Code',
          sortable: false, // disable sort for this column
           width: 150,
          selector: false,
          textAlign: 'center',
          sortable: 'asc'
        }, {
          field: 'comp_name',
          title: 'Company Name',
          //sortable: 'asc', // default sort
          filterable: false, // disable or enable filtering
         // width: 150,
          // basic templating support for column rendering,
       //   template: '{{OrderID}} - {{ShipCountry}}',
         }   , {
          field: 'create_user',
          title: 'Create User' 
         
       }
          , {
            field: 'create_datetime',
            title: 'Create Date',
            type: 'datetime',
            format: 'MM/DD/YYYY',
         },
         {
            field: 'Actions',
            width: 110,
            title: 'Actions',
            sortable: false,
            overflow: 'visible',
            template: function (row, index, datatable) {
              
              var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
              return '\<a   href="javascript:navigate_edit(\''+ row.comp_code +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
          			<i class="la la-edit"></i>\
          		</a>\
          		<a href="#" onclick="javascript:selectdel(\''+ row.comp_code +'\');return false;" data-toggle="modal" data-target="#m_modal_6" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
          			<i class="la la-trash"></i>\
          		</a>\
          	';
            }
          }
          
      ],
    });
 
  };

  return {
    // public functions
    init: function(apiurl) {
      load(apiurl );
    },reload: function(apiurl) {
      $('.m_datatable').mDatatable('reload');
    } 
  };
}();

 //jQuery(document).ready(function() {
 //  DatatableRemoteAjaxDemo.init('');
  //});
  function selectdel(compCode){
    $('#comCodeDeleteSelected').val(compCode);
 } 
 
 
  function navigate_edit(x){
    my.namespace.navigate_edit(x);
  
  }