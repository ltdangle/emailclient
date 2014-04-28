define(['dataContext', 'app_notification', 'plugins/router','helpers/parseMessage'], function (dataContext, app_notification, router, parseMessage) {
    var viewModel = {
        activate: function (account_id, message_id) {

            viewModel.account_id = account_id;
            viewModel.send = sendEmail;
            viewModel.body = '\n\nBest regards,\nYour signature';
            viewModel.to = '';
            viewModel.subject ='';

            //message_id is set, this is a reply to an email
            if (message_id) {
                var email = dataContext.getEmail(account_id, message_id);
                viewModel.to = email.from;
                viewModel.subject = 'Re:' + email.subject;
                viewModel.body = '\n\nBest regards,\nYour signature\n\n' + email.from + ' wrote on ' + email.date + ':\n\n' + email.body;

            }


            function sendEmail(viewModel) {
                var account = dataContext.findAccountById(viewModel.account_id);
                dataContext.sendEmail(viewModel.account_id, viewModel.to, account.id, viewModel.body).then(
                    function () {//success
                        app_notification.log('Message to ' + viewModel.to + ' sent');
                        router.navigate('#account-emails/' + viewModel.account_id);

                    }, function (error) {//failure
                        alert(error);
                    });

            }
            return true;
        },
        compositionComplete: function () {
            $('#email-body').focus();
        }
    };

    return viewModel;
})