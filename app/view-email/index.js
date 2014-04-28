define(['plugins/router', 'dataContext', 'helpers/parseMessage'], function (router, dataContext, parseMessage) {
    viewModel={
        activate: function(account_id, message_id){
            var email=dataContext.getEmail(account_id, message_id);
            viewModel.email=email;
            viewModel.email.body=parseMessage.convertLineBreaks2Html(email.body);
            viewModel.account_id=account_id;
            return true;
        },
        reply:function(viewModel){
            var email=viewModel.email;
            router.navigate('#compose-email/'+viewModel.account_id+'/reply-to/'+viewModel.email.message_id);
        },
        flagEmail: function(email){
            var email=viewModel.email;
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
                        alert ('Could not unfflag email. ' + error);
                    }
                )
            }
        }
    };

    return viewModel;

})