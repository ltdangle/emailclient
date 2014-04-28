define(['durandal/system'], function (system) {
    var email = {
        account_id: 'email@domain.com',
        date: "14 Apr 01:19:37",
        from: "digest-noreply@quora.com",
        isRead: true,
        isFlagged: false,
        subject:"Your Quora Digest - Top stories from your feed",
        body: "Question: What is something useful I can learn right now in 10 minutes that would be useful for the rest of my life?\n\nAnswer from Swami Nathan\nSource: Hack Your Brain: Polyphasic Sleep [ http://www.kratosguide.com/hack-your-brain-polyphasic-sleep/ ] \nIs your sleeping pattern irregular ( or rather unconventional)? Want to sleep less?\nHere is one of the greatest sleep hack...\nScientists really don’t know much about our sleeping patterns, which is a shame because we spend about a third of our lives sleeping. There is no defined biological\n\nRead More: http://www.quora.com/Tips-and-Hacks-for-Everyday-Life/What-is-something-useful-I-can-learn-right-now-in-10-minutes-that-would-be-useful-for-the-rest-of-my-life#ans2785773 ",
        message_id:system.guid()



    };


    function getEmails(){
        var emails=[];

        var email_count=(Math.random()*100).toFixed(0);

        for (var i = 0; i < email_count; i++) {
            var key=(Math.random()*100).toFixed(0);
            var email_copy=JSON.parse(JSON.stringify(email));//copy object by value
            email_copy.isRead=Math.random() >0.5 ? true : false;
            email_copy.date=email.date;
            email_copy.from=key + email.from;
            email_copy.subject=email.subject+key;
            email_copy.body=email.body;
            email_copy.message_id=system.guid();
            emails.push(email_copy);
        }

        return emails;
    }
    return {
        getEmails: getEmails
    };
})