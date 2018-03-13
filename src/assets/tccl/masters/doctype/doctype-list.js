//== Class definition
 
var myDatatable = function( ) {
  //== Private functions

  // basic demo
  var load = function( apiurl)  {
    
    var datatable = $('.m_datatable').mDatatable({
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

      sortable: true,
      pagination: true,
      toolbar: {
        // toolbar items
        items: {
          pagination: {
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
          field: 'doc_type_code',
          title: 'Doc Type Code',
          width: 150,
          selector: false,
          textAlign: 'center',
          sortable: 'asc'
        }, {   
          field: 'doc_type_desc',
          title: 'Description',
          sortable: true,
          filterable: false,
          // basic templating support for column rendering,
          //   template: '{{OrderID}} - {{ShipCountry}}',
         } , {
          field: 'create_user',
          title: 'Create User' 
         } , {
          field: 'create_datetime',
          title: 'Create Date',
          type: 'datetime',
         
          template: function(row) {
            return toDisplayDateTime(row.create_datetime);
          }
         } , {
            field: 'Actions',
            width: 110,
            title: 'Actions',
            sortable: false,
            overflow: 'visible',
            template: function (row, index, datatable) {
              
              var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
              return '\<a   href="javascript:navigate_edit(\''+ row.doc_type_code +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
          			<i class="la la-edit"></i>\
          		</a>\
          		<a href="#" onclick="javascript:selectdel(\''+ row.doc_type_code +'\');return false;" data-toggle="modal" data-target="#m_modal_6" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
          			<i class="la la-trash"></i>\
          		</a>\
          	';
            }
          }
        // }, {
        //   field: 'Status',
        //   title: 'Status',
        //   // callback function support for column rendering
        //   template: function(row) {
        //     var status = {
        //       1: {'title': 'Pending', 'class': 'm-badge--brand'},
        //       2: {'title': 'Delivered', 'class': ' m-badge--metal'},
        //       3: {'title': 'Canceled', 'class': ' m-badge--primary'},
        //       4: {'title': 'Success', 'class': ' m-badge--success'},
        //       5: {'title': 'Info', 'class': ' m-badge--info'},
        //       6: {'title': 'Danger', 'class': ' m-badge--danger'},
        //       7: {'title': 'Warning', 'class': ' m-badge--warning'},
        //     };
        //     return '<span class="m-badge ' + status[row.Status].class + ' m-badge--wide">' + status[row.Status].title + '</span>';
        //   },
        // }, {
        //   field: 'Type',
        //   title: 'Type',
        //   // callback function support for column rendering
        //   template: function(row) {
        //     var status = {
        //       1: {'title': 'Online', 'state': 'danger'},
        //       2: {'title': 'Retail', 'state': 'primary'},
        //       3: {'title': 'Direct', 'state': 'accent'},
        //     };
        //     return '<span class="m-badge m-badge--' + status[row.Type].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + status[row.Type].state + '">' +
        //         status[row.Type].title + '</span>';
        //   },
        // }, {
        //   field: 'Actions',
        //   width: 110,
        //   title: 'Actions',
        //   sortable: false,
        //   overflow: 'visible',
        //   template: function (row, index, datatable) {
        //     var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
        //     return '\
				// 		<div class="dropdown ' + dropup + '">\
				// 			<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
        //                         <i class="la la-ellipsis-h"></i>\
        //                     </a>\
				// 		  	<div class="dropdown-menu dropdown-menu-right">\
				// 		    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
				// 		    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
				// 		    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
				// 		  	</div>\
				// 		</div>\
				// 		<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
				// 			<i class="la la-edit"></i>\
				// 		</a>\
				// 		<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
				// 			<i class="la la-trash"></i>\
				// 		</a>\
				// 	';
        //   },
        // }
      ],
    });

    // $('#m_form_status').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'Status');
    // });

    // $('#m_form_type').on('change', function() {
    //   datatable.search($(this).val().toLowerCase(), 'Type');
    // });

    // $('#m_form_status, #m_form_type').selectpicker();

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
function selectdel(docTypeCode){
  $('#docTypeCodeDeleteSelected').val(docTypeCode);
} 
 
function navigate_edit(x){
 
  my.namespace.navigate_edit(x);
}