define(['knockout', 'helpers/parseMessage'], function (ko, parseMessage){
    function buildModel(account_id, email) {
        email.account_id=account_id;
        email.isSelected = ko.observable(false);//is email selected on the screen?
        email.isRead = ko.observable(email.isRead);//is email selected on the screen?
        email.isFlagged = ko.observable(email.isFlagged);//is email selected on the screen?
        email.body=parseMessage.convertLineBreaks2Html(email.body);//convert line breaks to html
        return email;
    }

    return {
        buildModel:buildModel
    }
})