define(['knockout'], function(ko){
   var ACCOUNTS = [
        {
            id: 'wrk',
            alias: 'Work email',
            email: 'testaccount@domain.com',
            emails: ko.observableArray([]),
            isLoading: ko.observable(false),
            isLoaded: ko.observable(false),
            unreadEmails: null, //ko.computed inserted here later on
        },
        {
            id: 'frlnc',
            alias: 'Freelance email',
            email: 'anotheremail@anotherdomain.com',
            emails: ko.observableArray([]),
            isLoading: ko.observable(false),
            isLoaded: ko.observable(false),
            unreadEmails: null, //ko.computed inserted here later on
        },
        {
            id: 'github',
            alias: 'GitHub projects',
            email: 'freelance@myotherdomain.com',
            emails: ko.observableArray([]),
            isLoading: ko.observable(false),
            isLoaded: ko.observable(false),
            unreadEmails: null, //ko.computed inserted here later on
        },
        {
            id: 'prsnl',
            alias: 'Personal',
            email: 'personal@personaldomain',
            emails: ko.observableArray([]),
            isLoading: ko.observable(false),
            isLoaded: ko.observable(false),
            unreadEmails: null, //ko.computed inserted here later on
        },
        {
            id: 'gmail',
            alias: 'Gmail',
            email: 'me@gmail.com',
            emails: ko.observableArray([]),
            isLoading: ko.observable(false),
            isLoaded: ko.observable(false),
            unreadEmails: null, //ko.computed inserted here later on
        }
    ];

    return ACCOUNTS;
})