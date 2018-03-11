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
               //form[0].submit(); // submit the form
            }
        });       
    }

    return {
        // public functions
        init: function() {
            demo1(); 
        },
    };
}();

jQuery(document).ready(function() {    
    FormControls.init();
});

