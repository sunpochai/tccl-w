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
    // alert('demos');
        $('#m_form_date_to').datepicker({
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    }
    return {
        // public functions
        init: function() {
            // alert('init');
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    // alert('js.ready');
    setTimeout(
        function() 
        {
            myData.init();
            // alert('myData.init -- 3000');
        }, 1500);
    
});