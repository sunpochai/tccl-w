var BootstrapDatepicker = function () {
  
  //== Private functions
  var demos = function () {

      // input group layout for modal demo
      $( "input[name='m_form_inv_date']" ).datepicker({
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        orientation: "bottom left",
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
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
  BootstrapDatepicker.init();
});