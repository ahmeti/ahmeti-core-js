$(document).ready(function() {

    // 1 Kez Çalışacak Fonksiyonlar...

    App.noAjaxUrl();
    App.pageResize();
    App.tooltip();
    App.advancedSearch();
    App.reminder();
    App.analytics();
    App.confirm();
    App.autoCloseMenu();
    App.addShortcut();
    App.setMenu();
    App.setAjaxPage();
    App.setChangeItem();
    App.modalRemove();
    App.setAppProcess();
    App.subscribeUserToPush();
    App.historyManager();

    App.runAllFunctions();
});


$(document).ready(function() {

    /*setInterval( function(){
        if( $('.app-base-alert').length ){
            $('.app-base-alert').fadeTo(100, 0.1).fadeTo(200, 1.0);
        }
    }, 1000);*/

    // Form Filter Ajax
    $(document).on( "click", ".filterFormButton", function(e) {

        e.preventDefault();
        var formData=$(this).closest("form");

        hedef=$('#'+formData.attr('id')+" input[name=hedef]").val();

        if ( ! App.empty(hedef) && hedef!=='ajaxPageContainer'){
            $('<a style="display:none" data-modal-size="xl" class="app-process" href="'+App.serializeForm(formData)+'">-</a>').appendTo($('body')).click().remove();
        }else{
            App.goAjaxUrl(App.serializeForm(formData), false);
        }
    });
    // End Form Filter Ajax

});