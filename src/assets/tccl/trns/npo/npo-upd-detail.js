//== Class definition
 

var myData = function () {
    var demos = function () {
        $('#m_form_date_from').datepicker({
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
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    setTimeout(
        function() 
        {
            myData.init();
        }, 1500
    );
    
});