﻿define(['plugins/router', 'durandal/app', 'knockout'], function (router, app, ko) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.header=ko.observable('this is router');
            router.goHome=function(){ router.navigate('') },
            router.map([
                { route: '', title:'Email accounts', moduleId: 'account-list/index', nav: true },
                { route: 'account-emails/:account_id', moduleId: 'account-emails/index', nav: true },
                { route: 'view-email/:account_id/:message_id', moduleId: 'view-email/index', nav: true },
                { route: 'compose-email/:account_id', moduleId: 'compose-email/index', nav: true },
                { route: 'compose-email/:account_id/reply-to/:message_id', moduleId: 'compose-email/index', nav: true },
                { route: 'test/:account_id', title:'test', moduleId: 'test/index', nav: true },

            ]).buildNavigationModel().activate();

            FastClick.attach(document.body);

            return router;
        }
    };
});