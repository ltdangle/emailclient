define(['knockout', 'durandal/app', 'dataService', 'dataModel', 'data/messageModel', 'app_notification'], function (ko, app, dataService, dataModel, messageModel, app_notification) {

    //private data object
    var ACCOUNTS = dataModel;
    window.ACCOUNTS = ACCOUNTS;

    //private methods


    //public interface
    function findAccountById(account_id) {
        var account = _.find(ACCOUNTS, function (obj) {
            return obj.id == account_id;
        });
        return account;
    }

    function findEmailByAccountAndMessageId(account_id, message_id) {
        var account = findAccountById(account_id);
        return _.find(account.emails(), function (obj) {
            return obj.message_id == message_id;
        });
    }

    function getAccountList() {
        var account_list = [];
        for (var i = 0; i < ACCOUNTS.length; i++) {
            account_list.push({id: ACCOUNTS[i].id, alias: ACCOUNTS[i].alias});
        }
        return account_list;
    }

    function loadAllAccounts(brute_reload) {
        for (var i = 0; i < ACCOUNTS.length; i++) {

            //load each account
            (function (i) {

                //this is request to refresh all accounts
                if (brute_reload) {
                    var load_options={brute_load:true}
                    loadAccount(ACCOUNTS[i].id, load_options);
                }

                //load only if account hasn't been loaded already
                else if (!ACCOUNTS[i].isLoaded()) {
                    loadAccount(ACCOUNTS[i].id);
                }
            })(i);

        }
    }

    function loadAccount(account_id, options) {
        var load_options= options || {};
        var dfd = Q.defer();

        var account = findAccountById(account_id);

        //if this account had been loaded, don't load it again
        if (account.isLoaded() && !load_options.brute_load) {
            dfd.resolve();
            return dfd.promise;
        }

        account.isLoading(true);
        app_notification.log('Loading account: ' + account.alias);

        dataService.getAccountData(account.id).then(
            function (emails) {//success

                //clear previous emails (for now)
                account.emails.removeAll();

                //build email model with observables and add to dataContext
                for (var i = 0; i < emails.length; i++) {
                    var email = messageModel.buildModel(account.id, emails[i]);
                    account.emails.push(email);
                }

                account.unreadEmails = ko.computed(function () {
                            return _.filter(account.emails(), function (email) {
                                return email.isRead() == false;
                            });
                });

                account.flaggedEmails = ko.computed(function () {
                    return _.filter(account.emails(), function (email) {
                        return email.isFlagged() == true;
                    });
                });

                account.isLoading(false);
                account.isLoaded(true);


                console.log(account.id + ' loaded');
                app_notification.log('Account loaded: ' + account.alias);


                dfd.resolve(account);

            },
            function (error) {//failure

                account.isLoading(false);
                account.isLoaded(false);
                app_notification.log('Account could not be loaded: ' + account.alias + '. ' + error);

                dfd.reject();

            }
        );

        return dfd.promise;
    }


    function getEmails(account_id) {
        var account = findAccountById(account_id);

        return account.emails;
    }

    function isAccountLoading(account_id) {
        var account = findAccountById(account_id);
        return account.isLoading;
    }

    function isAccountLoaded(account_id) {
        var account = findAccountById(account_id);
        return account.isLoaded;
    }

    function getEmail(account_id, message_id) {
        var account=findAccountById(account_id);
        var email = _.find(account.emails(), function (email){
           return email.message_id==message_id;
        });
        return email;
    }

    function sendEmail(account_id, to, from, body) {
        var dfd = Q.defer();
        dataService.sendEmail(account_id, to, from, body).then(function(){
            dfd.resolve();
        }, function (error){
            dfd.reject('Tried sending email to '+to+' and got a message: '+error);
        });
        return dfd.promise;
    }


    function deleteEmails(account_id, emails) {
        var dfd = Q.defer();
        dataService.deleteEmails(emails).then(
            function () {//promise resolved
                //delete emails from dataContext
                var account = findAccountById(account_id);
                account.emails.removeAll(emails);

                dfd.resolve();

            }, function (error) {//promise failed
                dfd.reject('Tried to delete emails from server and got ' + error);
            });

        return dfd.promise;
    }

    function flagEmail(account_id, message_id) {
        var dfd = Q.defer();
        dataService.flagEmail(account_id, message_id, 'flag').then(
            function () {//promise resolved

                //flag this email in the dataContext
                var email = findEmailByAccountAndMessageId(account_id, message_id);

                email.isFlagged(true);

                dfd.resolve();
            },
            function (error) {//promise failed

                dfd.reject('Tried to flag email "' + email.subject + '" from ' + account_id + ' and got ' + error);
            }
        );

        return dfd.promise;
    }

    function unFlagEmail(account_id, message_id) {
        var dfd = Q.defer();
        dataService.flagEmail(account_id, message_id, 'unflag').then(
            function () {//promise resolved

                //flag this email in the dataContext
                var email = findEmailByAccountAndMessageId(account_id, message_id);

                email.isFlagged(false);

                dfd.resolve();
            },
            function (error) {//promise failed

                dfd.reject('Tried to unflag email "' + email.subject + '" from ' + account_id + ' and got ' + error);
            }
        );

        return dfd.promise;
    }

    var dataContext = {
        ACCOUNTS:ACCOUNTS,
        findAccountById: findAccountById,
        getAccountList: getAccountList,
        loadAllAccounts: loadAllAccounts,
        loadAccount: loadAccount,
        isAccountLoading: isAccountLoading,
        isAccountLoaded: isAccountLoaded,
        getEmails: getEmails,
        getEmail: getEmail,
        sendEmail: sendEmail,
        deleteEmails: deleteEmails,
        flagEmail: flagEmail,
        unFlagEmail: unFlagEmail

    }


    return dataContext;
})