define([], function () {
    function convertLineBreaks2Html(message) {
        return message.replace(/(\r\n|\n|\r)/gm, "<br />");
    }

    return {
        convertLineBreaks2Html: convertLineBreaks2Html
    };
})