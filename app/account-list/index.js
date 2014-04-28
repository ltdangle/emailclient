define(['plugins/router', 'text!./header_actions.html', 'knockout', 'dataContext', 'durandal/app'], function (router, header_actions, ko, dataContext, app, header) {

    router.header('this is account list');

    var accounts = [];
    var account_list = dataContext.getAccountList();

    //build accounts view model
    for (var i = 0; i < account_list.length; i++) {

        dataContext.loadAccount(account_list[i].id, null).then(function (account) {
            account.loadAccount = function (account) {
                dataContext.loadAccount(account.id, {brute_load: true});
            }
            viewModel.accounts.push(account);
        });

    }


    viewModel = {
        accounts: ko.observableArray([]),
        myProperty: function () {
            return 'thisIsMyPropertyValue'
        },
        compositionComplete: function (view) {
            var header = document.getElementById('header-actions');
            //remove previous binding
            ko.cleanNode(header);
            //insert html template
            header.innerHTML = header_actions;
            //bind template to view model
            ko.applyBindings(headerVM(), header);

            //load account messages
            dataContext.loadAllAccounts();

        }};
    return viewModel;

    function headerVM() {
        function loadAllAccounts() {
            var brute_reload = true;
            dataContext.loadAllAccounts(brute_reload);
        }

        return {
            loadAllAccounts: loadAllAccounts
        }
    }
});