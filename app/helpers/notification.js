define (['jquery'], function ($){
    function log(message){
        $('#app_notification').text(message);
    }
    return {
        log:log
    };
})