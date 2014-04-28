﻿define(['text!./header_actions.html', 'knockout', 'dataContext', 'app_notification', 'plugins/router'], function (header_actions, ko, dataContext, app_notification, router) {

router.header('this is emails view');

    var viewModel = {
        activate: activate,
        compositionComplete: compositionComplete
    };


    return viewModel;

    function activate(account_id) {
        var dfd = Q.defer();
        //load account if it has not been loaded
        //used when directly accessed by url
            dataContext.loadAccount(account_id, null).then(
                function (){//success
                    var account=dataContext.findAccountById(account_id);

                    viewModel.account_id = account_id;
                    viewModel.alias = account.alias;
                    viewModel.emails = dataContext.getEmails(account_id);
                    viewModel.flaggedEmails=account.flaggedEmails;
                    viewModel.unreadEmails=account.unreadEmails;
                    viewModel.selectedEmails = ko.computed(function () {
                        return _.filter(viewModel.emails(), function (email) {
                            return email.isSelected() == true;
                        });
                    })
                    viewModel.selectedEmails.subscribe(function (selectedEmails) {
                        app_notification.log(selectedEmails.length + ' emails selected');
                    });



                    viewModel.viewEmail=function(email){
                        email.isRead(true);
                        router.navigate('#view-email/'+email.account_id+'/'+email.message_id);
                    }

                    viewModel.flagEmail=function (email){
                        console.log('flag email');
                        if (!email.isFlagged()){
                            flagEmail(email);
                        }else {
                            unFlagEmail(email);
                        }

                        function flagEmail(email){
                            dataContext.flagEmail(email.account_id, email.message_id).then (
                                function (){//success
                                    app_notification.log('Email is flagged');
                                },
                                function (error){//failure
                                    alert ('Could not flag email. ' + error);
                                }
                            )
                        }

                        function unFlagEmail(email){
                            dataContext.unFlagEmail(email.account_id, email.message_id).then (
                                function (){//success
                                    app_notification.log('Email is unflagged');
                                },
                                function (error){//failure
                                    alert ('Could not unflag email. ' + error);
                                }
                            )
                        }
                    }

                    dfd.resolve();
                },
                function (error){//failure
                    alert ('Viewmodel could not load data. '+ error);
                    dfd.reject();
                }
            );

        return dfd.promise;

    }

    function compositionComplete(view) {//update header actions
        var header = document.getElementById('header-actions');
        //remove previous binding
        ko.cleanNode(header);
        //insert html template
        header.innerHTML = header_actions;
        //bind template to view model
        ko.applyBindings(headerVM(), header);

    }


    function headerVM() {
        //set viewModel flag for visual feedback
        var deleteInProgress = ko.observable(false);


        function loadAccountEmails() {
            dataContext.loadAccount(viewModel.account_id, {brute_load:true});
        }

        function deleteEmails() {

            //find selected emails from viewModel
            var selected_emails = _.filter(viewModel.emails(), function (email) {
                return email.isSelected() == true;
            });

            //exit if no emails selected
            if (!selected_emails.length > 0) {
                app_notification.log('Can\'t delete messages. None selected.');
                return;
            }
            ;

            deleteInProgress(true);
            app_notification.log('Deleting selected emails...');

            //delete selected emails from server via promise
            dataContext.deleteEmails(viewModel.account_id, selected_emails).then(
                function () {
                    deleteInProgress(false);
                    app_notification.log('Selected emails deleted.');
                },
                function (error) {
                    alert('Could not delete selected emails. ' + error);
                    app_notification.log('Could not delete selected emails. ' + error);
                    deleteInProgress(false);
                }
            );

        }

        function composeEmail(){
            router.navigate('#compose-email/'+viewModel.account_id);
        }

        var alias=viewModel.alias;
        var emails=viewModel.emails;
        var unreadEmails=viewModel.unreadEmails;
        var flaggedEmails=viewModel.flaggedEmails;


        return {
            account_id: viewModel.account_id,
            alias:alias,
            emails:emails,
            unreadEmails:unreadEmails,
            flaggedEmails:flaggedEmails,
            loadAccountEmails: loadAccountEmails,
            isAccountLoading: dataContext.isAccountLoading(viewModel.account_id),
            deleteEmails: deleteEmails,
            deleteInProgress: deleteInProgress,
            composeEmail:composeEmail,
        }
    }


})
;