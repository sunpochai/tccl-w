//== Class definition
 

var AutoCompleteControl = function () {


    function formatRepo(repo) {
      /*   if (repo.loading) return repo.text;

        var markup = "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__meta'>" +
        "<div class='select2-result-repository__title'>" + repo.tracking_code + ":" + repo.tracking_name + "</div></div></div>"; */
     
        if (repo.loading) return repo.text;
        var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.name   + "</div>";
        
            "</div></div>";
       
    return markup;
    }  
    function formatRepoSelection(repo) {
       
        return repo.name || repo.text;
    }
    var loadTracking = function (api) { 
        $('#m_select2_6').select2({
            placeholder: "Enter Tracking No",
            allowClear: true,
            ajax: {   
                    
                url:  api,
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return { 
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    
                    params.page = params.page || 1;
  
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength:  2,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });

    }
 
return {
    load: function(api) {
         loadTracking(api);
      
    }
};
}();

