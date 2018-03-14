//== Class definition
 

var AutoCompleteControl = function () {


    function formatRepo(repo) {
       
        if (repo.loading) return repo.text;
         
        var markup = "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.tracking_code + "</div>";
  
        markup += "<div class='select2-result-repository__statistics'>" +
            "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.tracking_code + " Forks</div>" +
            "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.tracking_code + " Stars</div>" +
            "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.tracking_code + " Watchers</div>" +
            "</div>" +
            "</div></div>";
    
        return markup;
    }; 
    function formatRepoSelection(repo) {
        return repo.tracking_code || repo.tracking_name;
    }
    var loadTracking = function (api) { 
        $('#track').select2({
            placeholder: "Search tracking",
            allowClear: true,
            ajax: {
                 
                url:  "https://api.github.com/search/repositories",
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
            minimumInputLength: 3,
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

