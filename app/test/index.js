define(['knockout'], function (ko) {

    return {
        activate: function(account_id){
          alert(account_id);
        },
        compositionComplete: function (view) {
            var header = document.getElementById('header-actions');
            ko.cleanNode(header);

            var header_view='<span data-bind="text: action"></span>';
            header.innerHTML=header_view;

            var head_view_model={
                action:'Test'
            };

            ko.applyBindings(head_view_model, header);

        }};
})