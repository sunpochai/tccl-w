//== Class definition

var FormControls = function () {
    //== Private functions
    
    var demo1 = function () {
        $( "#m_form_1" ).validate({
            // define validation rules
            /* rules: {
                doctypecode: {
                    required: true,
                    maxlength: 4
                },
                doctypedesc: {
                    required: true,
                    maxlength: 25
                }
            }, */
            
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



    var  alertSuccess = function () {  
        alert('yoyo');
    }; 

    return {
        // public functions
        init: function() {
            demo1(); 
        }
    };
}();

jQuery(document).ready(function() {    
    FormControls.init();

    var txt = "<table class='table table-bordered m-table m-table--border-info m-table--head-bg-info'>" +
                    "<thead>" + 
					"<tr>" + 
					"<th>No</th><th>Budget</th><th>Description</th><th>Qty</th><th>Unit</th><th>Est. Price</th><th>Currency</th><th>Delivery Date</th>" + 
					"</tr>" + 
					"</thead>" + 
					"<tbody><tr><th scope='row'>00010</th>" + 
					"<td></td><td>สีน้ำพลาสติก E 507</td>" + 
					"<td style='text-align:right '>1</td>" + 
					"<td style='text-align:center '> DR</td>" + 
					"<td style='text-align:right '>20,000.000</td>" + 
					"<td style='text-align:center '>THB</td>" + 
					"<td style='text-align:center '>25/03/2018</td>" + 
					"</tr>" + 
					"<tr>" + 
					"<td style='text-align:right ' colspan='5'> Total</td>" + 
					"<td style='text-align:right ' >20,000.000</td>" + 
					"<td style='text-align:right ' colspan='2'></td>" + 
					"</tr>" + 
                    "</tbody>" +
                    "</table>";
        $("#tabItems").html(txt);
});

