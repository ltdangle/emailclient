define(['jquery', 'mockjax', 'fixtures', 'knockout'], function ($, mockjax, fixtures, ko) {


    var ACCOUNT_EMAILS_URL = 'loadAccountMessages.php';
    var DELETE_EMAILS_URL = 'deleteMessages.php';
    var FLAG_EMAIL_URL = 'setFlag.php';
    var SEND_EMAIL_URL = 'sendMessage.php';

//    Mockjax setup for mocking ajax requests
    $.mockjax({
        url: ACCOUNT_EMAILS_URL,
        type: 'get',
        responseTime: 1000,
        response: function () {
            this.responseText = JSON.stringify(fixtures.getEmails());
        }
    });

    $.mockjax({
        url: DELETE_EMAILS_URL,
        type: 'post',
        responseTime: 1000,
        response: function () {
            this.responseText = JSON.stringify({status: 'ok'});
        }
    });

    $.mockjax({
        url: FLAG_EMAIL_URL,
        type: 'post',
        responseTime: 1000,
        response: function () {
            this.responseText = JSON.stringify({status: 'ok'});
        }
    });

    $.mockjax({
        url: SEND_EMAIL_URL,
        type: 'post',
        responseTime: 1000,
        response: function () {
            this.responseText = JSON.stringify({status: 'ok'});
        }
    });

    return {
        getAccountData: getAccountData,
        deleteEmails: deleteEmails,
        flagEmail: flagEmail,
        sendEmail: sendEmail
    }

    function getAccountData(account_id) {

        var dfd = Q.defer();

        $.ajax({
            type: 'get',
            url: ACCOUNT_EMAILS_URL,
            data: { account_id: account_id },
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                dfd.resolve(data);
                return;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                dfd.reject(textStatus + ': ' + errorThrown);
                return;
            }
        });

        return dfd.promise;
    }

    function deleteEmails(emails) {
        var dfd = Q.defer();

        //build data to be sent to server - get message ids only from emails
        var data = [];
        for (var i = 0; i < emails.length; i++) {
            data.push({account_id: emails[i].account_id, message_id: emails[i].message_id})
        }

        $.ajax({
            type: 'post',
            url: DELETE_EMAILS_URL,
            data: data,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                dfd.resolve();
                return;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                dfd.reject('[' + textStatus + ': ' + errorThrown + ']');
                return;
            }
        });

        return dfd.promise;
    }

    function flagEmail(account_id, message_id, flag) {
        var dfd = Q.defer();
        $.ajax({
            type: 'post',
            url: FLAG_EMAIL_URL,
            data: {account_id: account_id, message_id: message_id, flag: flag},
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                dfd.resolve();
                return;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                dfd.reject('[' + textStatus + ': ' + errorThrown + ']');
                return;
            }
        });

        return dfd.promise;
    }

    function sendEmail(account_id, to, from, body){
        var dfd = Q.defer();
        $.ajax({
            type: 'get',
            url: SEND_EMAIL_URL,
            data: {account_id: account_id, to: to, from: from, body:body},
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                dfd.resolve();
                return;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                dfd.reject('[' + textStatus + ': ' + errorThrown + ']');
                return;
            }
        });

        return dfd.promise;
    }


})