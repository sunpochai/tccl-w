//== Class definition
 

var myData = function () {
    //  alert('mydata(js)');
    var demos = function () {
        $('#txt_inv_date').datepicker({
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            },
        });
        
    }
    return {
        // public functions
        init: function() {
            // alert('init (js)');
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    // alert('ready');
    setTimeout(
        function() 
        {
            myData.init();
        }, 1200
    );
    
});