//== Class definition

var FormControls = function () {
    //== Private functions
    
    var demo1 = function () {
        $( "#m_form_1" ).validate({
            // define validation rules
            rules: {
                trackingcode: {
                    required: true,
                   // minlength: 5 
                },
                trackingname: {
                    required: true 
                } ,
                company: {
                    required: true 
                }   
            },
                   
            //display error alert on form submit  
            invalidHandler: function(event, validator) {     
                var alert = $('#m_form_1_msg');
                alert.removeClass('m--hide').show();
                mApp.scrollTo(alert, -200);
            },

            submitHandler: function (form) {
                  
                    mApp.block('#m_form_1', {});
     
                    setTimeout(function() {
                        mApp.unblock('#m_form_1');
                    }, 10000);
               //form[0].submit(); // submit the form
            }
        });       
    }

  var  alertSuccess = function () {  
    alert('yoyo');
}; 

    return {
        // public functions
        init: function() {
            demo1(); 
             
        },
        alertSuccess: function() {
            $('[data-switch=true]').bootstrapSwitch();
            var content = {};
 
            content.message = 'New order has been placed';
             
                content.title = 'Notification Title';
            
            
                content.icon = 'icon '  ;
            

            var notify = $.notify(content, { 
                type: 'success',
              //  allow_dismiss: $('#m_notify_dismiss').prop('checked'),
               // newest_on_top: $('#m_notify_top').prop('checked'),
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
        }
    };
}();

jQuery(document).ready(function() {    
    FormControls.init();
});

