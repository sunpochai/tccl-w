 
var myDatatable = function( ) {

  var load = function( apiurl)  {

    var datatable = $('.m_datatable').mDatatable({
      data: {  
        saveState:false,
        type: 'remote',
        source: {
          read: {
            method: 'POST',
            url: apiurl,
            map: function(raw) {
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

      layout: {
        scroll: false,
        footer: false,
        theme: "default"
      },

      sortable: true,
      pagination: true,

      toolbar: {
        items: {
          pagination: {
            pageSizeSelect: [5,10, 20, 30, 50, 100],
          },
        },
      },
 
      search: {
        input: $('#generalSearch')
      },

      columns: [
        {
          field: 'plant_code',
          title: 'Plant Code',
          width: 150,
          selector: false,
          textAlign: 'center',
          sortable: 'asc'
        }, {   
          field: 'plant_name',
          title: 'Plant Name',
          sortable: true,
          filterable: false,
        } , {
          field: 'update_user',
          title: 'Last Update User' 
        } , {
          field: 'update_datetime',
          title: 'Last Update Date',
          type: 'datetime',
          template: function(row) {
            return toDisplayDateTime(row.update_datetime);
          }
        } , {
          field: 'Actions',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row, index, datatable) {
            return '\<a   href="javascript:navigate_edit(\''+ row.plant_code +'\')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
              <i class="la la-edit"></i>\
            </a>\
            <a href="#" onclick="javascript:selectdel(\''+ row.plant_code +'\');return false;" data-toggle="modal" data-target="#m_modal_6" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
              <i class="la la-trash"></i>\
            </a>\
            ';
          }
        }
      ],
    });

  };

  return {
    init: function(apiurl) {
      load(apiurl );
    },reload: function(apiurl) {
      $('.m_datatable').mDatatable('reload');
    } 
  };
}();

function selectdel(key){
  my.namespace.prepare_del(key);
} 
 
function navigate_edit(x){
  my.namespace.navigate_edit(x);
}