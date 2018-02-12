/**
 * @class myBundle  Metronic App class
 */

var myBundle = function(msg)  {

    var showSuccess = function(msg){
        $('[data-switch=true]').bootstrapSwitch();
        var content = {};
            content.message = msg;
            //content.title = 'Success';
           // content.icon = 'icon '  ;
        

        var notify = $.notify(content, { 
            type: 'success',
          //  allow_dismiss: $('#m_notify_dismiss').prop('checked'),
            newest_on_top: true,
          //  mouse_over:  $('#m_notify_pause').prop('checked'),
           // showProgressbar:  $('#m_notify_progress').prop('checked'),
           // spacing: $('#m_notify_spacing').val(),                    
            timer: 2000,
             placement: {
                 from: 'top', 
                 align: 'right'   
            },
            offset: {
                x: 30, 
                y: 30
            },
            delay: 1000,
            z_index: 10000,
            animate: {
                enter: 'animated ' + 'bounce',
                exit: 'animated ' + + 'bounce'
            }
        });
    };
    var showError = function(msg){
        $('[data-switch=true]').bootstrapSwitch();
        var content = {};
            content.message = msg;
            //content.title = 'danger';
            content.icon = 'icon la la-warning'  ;
        

        var notify = $.notify(content, { 
            type: 'danger',
          //  allow_dismiss: $('#m_notify_dismiss').prop('checked'),
           // newest_on_top: $('#m_notify_top').prop('checked'),
          //  mouse_over:  $('#m_notify_pause').prop('checked'),
           // showProgressbar:  $('#m_notify_progress').prop('checked'),
           // spacing: $('#m_notify_spacing').val(),                    
            timer: 5000,
             placement: {
                 from: 'top', 
                 align: 'right'   
            },
            offset: {
                x: 30, 
                y: 30
            },
            delay: 1000,
            z_index: 10000,
            animate: {
                enter: 'animated ' + 'bounce',
                exit: 'animated ' + + 'bounce'
            }
        });
    };
    return {
        // public functions
        showSuccess: function(msg) {
            showSuccess(msg); 
             
        } ,showError: function(msg) {
            showError(msg); 
             
        } 
        ,block: function(msg) {
            mApp.block(msg);
             
        } 
        ,unblock: function(msg) {
            mApp.unblock(msg);
             
        } 
    };
 }();