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
          field: 'doc_type',
          title: 'Doc Type',
          sortable: true,
          textAlign: 'center',
          
        } , {
          field: 'pr_no',
          title: 'PR No.',
          selector: false,
          textAlign: 'center',
          sortable: true,
          
          
          template: function (row) {
            return '<a href="./trns/pr/detail/' + row.pr_no + '" title="Purchase Request Detail">' + row.pr_no + '</a>';
            /* return '\
              <a href="javascript:navigate_edit(' + row.pr_id + ')" title="Purchase Request Detail">\
                              '+row.pr_no+'\
                          </a>\
            ';  */
          }
        }, {   
          field: 'pr_date',
          title: 'PR Date',
          textAlign: 'center',
          sortable: 'desc',
          template: function(row) {
            return toDisplayDate(row.pr_date);
          }  
        }, {
          field: 'grand_total',
          title: 'Est. Price',
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
          field: 'currency',
          title: 'Currency',
          sortable: true,
          textAlign: 'center',
        } , {
          field: 'plant_name',
          title: 'Plant',
          sortable: true,
          template: function (row) {
            return row.plant_code + ' ' + row.plant_name;
          }
        } , {
          field: 'subject',
          title: 'Subject',
          sortable: true,
        } , {
          field: 'tracking_no',
          title: 'Tracking Code',
          sortable: true,
        } , {
          field: 'create_username',
          title: 'Requisitioner',
          sortable: true,
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
        }/*  , {
          field: 'create_datetime',
          title: 'Create Date',
          template: function(row) {
            return      toDisplayDate(row.create_datetime);
          }
        } */
      ],
    });

    // datepicker
    $('#m_form_date_from').datepicker({
      todayHighlight: true,
      format: 'dd/mm/yyyy',
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      },
      // minDate: new Date(),
      // onSelect: function(dateStr) 
      // {         
          // $("#m_form_date_to").datepicker("destroy");
          // $("#m_form_date_to").val(dateStr);
          // $("#m_form_date_to").datepicker({ minDate: new Date(dateStr)});
      //     alert(dateStr);
      // }
    });

    // $('m_form_date_from').datepicker({
    //   onSelect: function(formattedDate, date, inst) {
    //       $(inst.el).trigger('change');
    //       alert('d');
    //   }
    // });

    // $('#m_form_date_from').datepicker()
    // .on(picker_event, function(e) {
    //   alert('c');
    //     // `e` here contains the extra attributes
    // });

// alert('b');
  //   $("#from").datepicker({
  //     defaultDate: new Date(),
  //     minDate: new Date(),
  //     onSelect: function(dateStr) 
  //     {         
  //         $("#to").datepicker("destroy");
  //         $("#to").val(dateStr);
  //         $("#to").datepicker({ minDate: new Date(dateStr)})
  //     }
  // });

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
    
    query.pr_no = $('#m_form_pr_no').val();
    query.doc_type = $('#m_form_doc_type').val();
    query.pr_date_from = toInternalDate($('#m_form_date_from').val());
    query.pr_date_to = toInternalDate($('#m_form_date_to').val());
    query.comp_code = $('#m_form_company').val();
    // query.subject = $('#m_form_subject').val();
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
/* 
function navigate_edit(prId){
  my.namespace.navigate_edit(prId);
} */

 