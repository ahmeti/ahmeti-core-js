var App = {

    googleAnalyticsId: null, // UA-27241XXX-2

    company_uuid: baseApp.company_uuid,

    url : baseApp.url,

    userid : baseApp.userid,

    isMobile : baseApp.isMobile,

    platform: baseApp.platform,

    orderColumnName: baseApp.orderColumnName ? baseApp.orderColumnName : null,
    orderTypeName: baseApp.orderTypeName ? baseApp.orderTypeName : null,

    changeItem: false,

    serviceWorker: false,

    isPushPermission: false,

    currentUrl: window.location.href,

    // Sayfaya dahil edilmiş dosyaları tutar...
    included : [
    ],

    files : {
        raphael   : 'js/raphael/raphael.js',
        mapturkey : 'js/map/turkey.js',
        mapcount  : 'js/map/count.js'
    },

    clickAppProcess: function(url)
    {
        $('<a target="_blank" class="app-process" style="display:none" href="'+ url +'">-</a>').appendTo($('body'))[0].click();
    },

    // No Go Other Page
    setChangeItem : function()
    {
        $(window).bind('beforeunload', function(){
            if (App.changeItem){
                return 'Değişiklikleri kayıt etmediniz! Yine de sayfadan ayrılmak istiyor musunuz?';
            }
        });
    },

    askPushPermission: function ()
    {
        return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        });
    },

    subscribeUserToPush : function()
    {
        if ( ! ('PushManager' in window) ) {
            // Push isn't supported on this browser, disable or hide UI.
            return false;
        }

        App.askPushPermission().then(function (permissionResult) {
            if (permissionResult === 'granted') {
                App.isPushPermission = true;
                pushAdapter.start();
            }
        });
    },

    successAlert: function(message, title)
    {
        Swal({
            type: 'success',
            title: title ? title : 'İşlem Başarılı!',
            html: message ? message : '',
            confirmButtonText: 'Tamam',
        });
    },

    empty : function(data)
    {
        if (data===0 || data==='' || data===false) { return true; }
        if (typeof (data) == 'number' || typeof (data) == 'boolean'){ return false; }
        if (typeof (data) == 'undefined' || data === null){ return true; }
        if (typeof (data.length) != 'undefined'){ return data.length == 0; }
        var count = 0;
        for (var i in data)
        {
            if (data.hasOwnProperty(i))
            {
                count++;
            }
        }
        return count == 0;
    },

    isArray : function(arr)
    {
        return arr.constructor.toString().indexOf("Array") > -1;
    },

    require : function(arr)
    {
        if (App.empty(arr)){ return false; }

        $.each( arr, function( key, value ) {

            if ( jQuery.inArray(value, App.included) < 0 ){
                // Include edilmemiş ise

                $.ajax({
                    type: "GET",
                    url: App.url+"/"+App.files[value],
                    success: function(){
                        App.included.push(arr[key]);
                    },
                    dataType: "script",
                    async: false,
                    cache: true
                });
            }
        });
    },

    getJSON : function(url)
    {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            async: false, // Yüklenmeden bir sonraki satıra geçmez...
            success: function(data) {
                result = data;
            }
        });
        return result;
    },

    serializeForm : function(form)
    {
        var url;
        url=form.attr('action');
        f=form.serializeArray();
        text='';
        $.each(f, function(k, v){

            if ( ! App.empty(v.value) ){
                text+=v.name+'='+v.value+'&';
            }
        });
        return url+text;
    },

    analytics : function()
    {
        // Google Analistic
        if (baseApp.appEnv === 'production'){
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', App.googleAnalyticsId, 'auto');
            ga('send', 'pageview');
        }
    },

    getProcessId : function()
    {
        process_id=""+new Date().getTime();
        return process_id.substr(process_id.length-10, 8);
    },

    getUrlParam : function(name, url)
    {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    modalRemove : function()
    {
        $(document.body).on('hidden.bs.modal', function (e) {
            $('#'+e.target.id).remove();

            if ($('.app-content').length > 1){
                $(document.body).addClass('modal-open').css('padding',0);
            }else{
                $(document.body).removeClass('modal-open').css('padding',0);
                if ( App.isMobile ){
                    $(document.body).removeClass('fixed');
                }
            }
        });
    },

    log : function(data)
    {
        err=new Error();
        console.log(data);
        console.log(err);
    },

    modalHeightCall : function(modal_id)
    {
        // Modal Yükseklik Hesapla
        var body, bodypaddings, header, headerheight, height, modalheight, modal;
        modal =$('#'+modal_id);
        header = $('#'+modal_id+' .modal-header');
        body = $('#'+modal_id+' .modal-body');
        modalheight = parseInt(modal.css("height"));
        headerheight = parseInt(header.css("height")) + parseInt(header.css("padding-top")) + parseInt(header.css("padding-bottom"));
        bodypaddings = parseInt(body.css("padding-top")) + parseInt(body.css("padding-bottom"));
        height = modalheight - headerheight - bodypaddings - 5;
        $('#'+modal_id+' .modal-body').css("max-height", "" + height + "px");
        $('#'+modal_id).css("z-index", z_index);
        $('#'+modal_id).next().css("z-index", Number(z_index)-1);
        // Modal Yükseklik Hesapla
    },

    advancedSearch : function()
    {
        width=$(document.body).width();
        navbar_right=Number($('.app-navbar-top-task').width()) + Number($('.app-navbar-top-options').width());
        //console.log('logo:'+210+'###nav:'+navbar_right+'###width:'+width);

        if (width > 750){
            inputWidth=Number(width-210-170);
            s2width=( inputWidth > 500 ? 500 : inputWidth);

        }else if(width < 480){
            s2width=Number(width-30);
        }else{
            s2width=Number(width-190);
        }
        $('#advanced-search').delay(1000).css('width',s2width+"px").css('max-width',s2width+"px");
    },

    reminder : function(){

        /*setInterval(function(){
            $.ajax({
                method: "GET",
                url: App.url+"/gorev/say",
                dataType: "json",
                error: function(e){
                    return;
                },
                complete: function(e){

                    try {
                        say=Number(e.responseJSON.count);
                        $('.app-user-task-count').html((say > 0 ? say : '0'));
                        if (say > 0){
                            $('.app-base-alert').remove();
                            alert='<div class="row app-base-alert"><div class="col-sm-12">\n\
                                           <div class="alert alert-danger" style="margin:10px 0 0 0;background-color: #FF3333;border-color: #CC0000;color: white;padding:8px">\n\
                                               <a href="#" class="close" style="color:white;opacity: 1;padding: 0 8px; font-size:24px;margin-top: -5px" data-dismiss="alert" aria-label="close">&times;</a>\n\
                                               <i class="fa fa-tasks fa-fw"></i> <a style="color:white" class="app-process" href="'+App.url+'/tasks?kullanici_id='+App.userid+'&durum[]=wait&durum[]=work">Bekleyen <strong>'+say+'</strong> göreviniz bulunuyor.</a>\n\
                                            </div>\n\
                                      </div></div>';
                            $("#ajaxPageContainer").prepend(alert);
                        }
                    }catch(e){
                    }
                }
            });
        }, 3600000);*/
    },

    checkmail : function(email)
    {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    updateQueryString : function (key, value, url)
    {
        if (!url) url = window.location.href;
        var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }else{
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else
                return url;
        }
    },

    tooltip : function()
    {
        $('body').tooltip({
            container: 'body',
            trigger : 'hover',
            html: true,
            selector: '[data-toggle=tooltip]',
            delay: { "show": 300, "hide": 0 },
        });
    },

    // Tarayıcı adres barından direk sayfaya giriş için
    // Eğer sayfada direk link varsa ajax isteği gönder
    noAjaxUrl : function()
    {
        var noAjax=$("meta[name='noAjaxUrl']").attr('content');

        if ( noAjax != undefined){
            App.goAjaxUrl(noAjax);
        }
    },

    alert: function(status,message)
    {
        return '<div class="alert alert-'+(status ? 'success' : 'danger')+'" role="alert">'+message+'</div>';
    },

    pageResize : function()
    {
        //Loads the correct sidebar on window load,
        //collapses the sidebar on window resize.
        // Sets the min-height of #page-wrapper to window size
        $(window).bind("load resize", function() {

            topOffset = 50;
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = 100; // 2-row-menu
            } else {
                $('div.navbar-collapse').removeClass('collapse');
            }

            height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height-2) + "px");
            }
        });
    },

    // Disable Enter Submit Form
    stopEnterSubmitting : function(e)
    {
        if (e.keyCode == 13) {
            var src = e.srcElement || e.target;
            if (src.tagName.toLowerCase() != "textarea") {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        }
    },

    confirm : function()
    {
        $(document).on( "click", "a[data-confirm],button[data-confirm]", function(event) {

            event.preventDefault();

            el = $(this);
            title = el.attr('data-confirm-title') || 'Devam etmek istiyor musunuz?';
            url = el.attr('href');
            checkclass = el.attr('data-confirm-class') || 'ajaxPage';
            method = el.attr('data-method');
            text = el.attr('data-confirm');

            Swal.fire({
                title: title,
                text: text,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Evet !',
                cancelButtonText: 'Vazgeç'
            }).then((result) => {
                if (result.value) {
                    $('<a target="_blank" class="'+checkclass+'" style="display:none" href="'+ url +'" data-method="'+method+'">-</a>').appendTo($('body'))[0].click();
                }
            });

        });
    },

    // Only Mobile - After Click Slider Menu -> Close Menu
    autoCloseMenu : function()
    {
        $(document).on("click", ".ajaxPage", function(){
            $('.sidebar-nav').removeClass('in');
            $('.sidebar-nav').addClass('collapse');
        });
    },

    // Kısayol Modalına Mevcut Linki Ekler
    addShortcut : function()
    {
        $(document).on("change", ".app-form-kullanicikisayol input[name=adi]", function() {
            var link=App.updateQueryString('pageNo', '', window.location.href.replace(App.url+'/', "")).replace(/&?[^&?]+=(?=(?:&|$))/g, '').replace('?&','?');
            fid=$(this).closest('form').attr('id');
            $('#'+fid).find('input[name=kisayol]').val(link);
        });
    },

    // Side Menu
    setMenu : function()
    {
        $('#side-menu').metisMenu();
    },

    // ajaxPageContainer
    setAjaxPage : function()
    {
        $(document).on( "click", ".ajaxPage", function(e) {

            e.preventDefault();

            $('[role="tooltip"]').remove();

            if(e.shiftKey) {
                return App.clickAppProcess($(this).attr('href'));
            }

            var link=$(this).attr('href');
            var hedef=$(this).attr('data-target');
            var method=$(this).attr('data-method');

            if ( App.empty(hedef) ){
                // # data-target boş ise url hedef parametresine bak
                hedef=App.getUrlParam('hedef', link);
                if ( ! App.empty(hedef)){hedef='#'+hedef; }
            }

            if (App.changeItem === true && new URL(link).searchParams.get('output') !== 'modal' ){

                // ------------------------------------------------- Değişiklik Varsa Sayfadan Ayrılıyorsa Alert
                Swal({
                    title: 'Kayıt Etmediniz!',
                    html: 'Değişiklikleri kayıt etmediniz! Yine de sayfadan ayrılmak istiyor musunuz?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: "Sayfadan Ayrıl!",
                    cancelButtonText: "Sayfada Kal!"
                }).then(function(result) {

                    if ( result.value ) {
                        App.changeItem = false;
                        App.goAjaxUrl(link,false);
                    }

                });
                // ------------------------------------------------- Değişiklik Varsa Sayfadan Ayrılıyorsa Alert

            }else{
                App.goAjaxUrl(link, false, hedef, method);
            }
        });
        // End ajaxPageContainer
    },

    goAjaxUrl : function (link, back, hedef, method)
    {
        // console.log('goAjaxUrl ÇALIŞIYOR. LINK: '+link+' ## BACK: '+back+' ## HEDEF: '+hedef);

        if ( App.empty(hedef) ){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('.modal').remove();
            $('#dataConfirmModal').modal('hide');
            $('body').removeClass('fixed');

            hedef='#ajaxPageContainer';
        }

        if ( method && method != 'undefined' ){
            // Hiçbirşey yapma
        }else{
            method = 'GET';
        }

        $.ajax({
            type: method,
            cache: false,
            beforeSend: function () {

                if (hedef==='#ajaxPageContainer'){
                    if ( ! App.empty($('#current_page_jscode').html()) ){
                        sheet = document.getElementById('current_page_jscode');
                        sheet.parentNode.removeChild(sheet);
                        // Boşalt
                    }
                }
                $(hedef).empty();
                $(hedef).html('<div style="text-align:center;padding-top:30px;"><img style="width:100px;" src="'+App.url+'/images/loading.gif" /></div>');
            },
            url: link,
            //data: ,
            async: true,
            dataType: 'json',
            success: function (e) {

                if(e.gourl){
                    return App.goAjaxUrl(e.gourl);
                }

                if (baseApp.appEnv === 'production'){
                    // Google Analistic

                    ga('send','pageview', link.replace(App.url, ''));
                    //console.log('Send Google Analistic');
                }

                // Require js file...
                if ( ! App.empty(e.jsfile) ){ App.require(e.jsfile); }

                // Single Page Javascript Kodu Çalıştır...
                if ( ! App.empty(e.jscode) ){ setTimeout(function(){ App.addSinglePageJsCode(e.jscode); }, 30); }

                // Title
                $('html head').find('title').text(e.title);

                // Body
                if ( hedef=='ajaxPageContainer' || hedef=='#ajaxPageContainer' ){

                    App.currentUrl = link;

                    if (back!==true ){ History.pushState(null, e.title, link); }

                    $('#ajaxPageContainer').html(e.breadcrumb+e.body);

                    setTimeout(function () {
                        $("html, body").animate({ scrollTop: 0 }, "slow");
                    }, 10);

                }else{
                    $(hedef).html(e.body);
                }

                // Require js file...
                if ( ! App.empty(e.callback) ){
                    for(key in e.callback){

                        var i = e.callback[key];
                        i=i.split(".");

                        setTimeout(function() {
                            window[i[0]][i[1]]();
                        }, 20);
                    }
                }

                App.runAllFunctions();
            }
        });
    },

    getUID : function()
    {
        return new Date().valueOf();
    },

    numberFormat: function(number, decimals, dec_point, thousands_sep)
    {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },

    setAppProcess : function()
    {
        $(document).on( "click", ".app-process", function(e) {

            e.preventDefault();

            if( App.platform === 'electron' && $(this).attr('data-modal-type') === 'iframe' ){
                // return adapterElectron.ipcShowPdf($(this));
                return $('body').append('<webview src="'+ $(this).attr('href') +'" plugins></webview>')
                // <webview src="'+ link +'" plugins></webview>
            }else if ( App.platform === 'cordova' && $(this).attr('data-modal-type') === 'iframe' ){

                ext = $(this).attr('data-app-ext');

                if( ext && ext.length > 0 ){
                    return CordovaApp.openFile($(this).attr('href'), ext);
                }

                return console.log(ext);

                return CordovaApp.openFile($(this).attr('href'), 'pdf');
            }

            link=$(this).attr('href'); // Modal Form Url
            baseId=$(this).closest('.app-content').attr('id'); // Base Id

            if (baseId!=='ajaxPageContainer'){

                if ( baseId===undefined || App.empty(baseId) ){
                    baseId='ajaxPageContainer';
                }else{
                    baseId=baseId+'b';
                }
            }

            hedef=App.getUrlParam('hedef',link);
            hedef2=App.getUrlParam('hedef2',link);

            if ( ! App.empty(hedef) ){
                mid=hedef.replace('modal_','').replace('b','');
                modal_id="modal_"+mid;
                z_index=mid;
            }else{
                mid=App.getProcessId();
                modal_id="modal_"+mid;
                z_index=mid;
            }

            var modaltype=$(this).attr('data-modal-type'); // Iframe
            var modaltitle=$(this).attr('data-modal-title'); // Iframe ise Title Olmalı
            var modalSize=$(this).attr('data-modal-size');
            if ( App.empty(modalSize)  ){ modalSize=' modal-xl'; }else{ modalSize=' modal-'+modalSize; }

            modal_dialog='\
            <div class="modal-dialog'+modalSize+'">\n\
                <div class="modal-content">\n\
                    <div class="modal-header">\n\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n\
                        <h3 class="modal-title"><strong>Lütfen Bekleyiniz...</strong></h3>\n\
                    </div>\n\
                    <div id="'+modal_id+'b" class="modal-body" style="'+(modaltype=='iframe' ? 'overflow:hidden !important' : 'overflow-y:auto')+'">\n\
                        <div style="text-align:center;"><img style="width:100px;" src="'+App.url+'/images/loading.gif" /></div>\n\
                    </div>\n\
                </div>\n\
            </div>';

            if ( ! App.empty(hedef) ){
                $('#'+modal_id).html(modal_dialog);
            }else{
                $('body').append('\
                <div id="'+modal_id+'" class="modal app-content" style="'+(modaltype=='iframe' ? 'overflow:hidden !important;' : 'overflow:auto;')+'" role="dialog">'+modal_dialog+'</div>');
            }

            $(document.body).addClass('modal-open');
            if ( App.isMobile ){
                $(document.body).addClass('fixed');
            }
            $('#'+modal_id).modal({show:true});

            // Modal Hight Caluacete
            App.modalHeightCall(modal_id);

            if (modaltype=='iframe'){
                $('#'+modal_id+' .modal-header .modal-title strong').text(modaltitle);
                $('#'+modal_id+' .modal-content .modal-body').html('<div class="iframe-container"><iframe src="'+link+'"></iframe></div>');
                return false;
            }else{

                $.ajax({
                    type: 'GET',
                    cache: false,
                    url: link,
                    data: { output: "modal", hedef:modal_id+'b', baseid:baseId, hedef2:hedef2},
                    dataType: 'json',
                    success: function (e) {

                        $('#'+modal_id+' .modal-header .modal-title strong').text(e.title);
                        $('#'+modal_id+' .modal-content .modal-body').html(e.body);
                        // Single Page Javascript Kodu Çalıştır...
                        if ( ! App.empty(e.jscode) ){ setTimeout(function(){ App.addSinglePageJsCode(e.jscode); }, 30); }
                    },
                    complete:function(){
                        App.runAllFunctions();
                    }
                });
            }
        });
    },

    historyManager: function()
    {
        History.Adapter.bind(window, 'statechange', function(){
            State = History.getState();
            if( State.url !== App.currentUrl){
                url = App.currentUrl = State.url;
                url = App.updateQueryString('output', '', url);
                url = App.updateQueryString('hedef', '', url);
                url = App.updateQueryString('baseid', '', url);
                url = App.updateQueryString('hedef2', '', url);
                App.goAjaxUrl(url, true);
            }
        });
    },

    // Single Page Javascript Code
    addSinglePageJsCode : function(code)
    {
        var JS= document.createElement('script');
        JS.setAttribute("id", 'current_page_jscode');
        JS.text= code;
        document.body.appendChild(JS);
    },

    // Modal Page Javascript Code
    addModalSinglePageJsCode: function (code)
    {
        var JS= document.createElement('script');
        JS.setAttribute("id", 'current_page_jscode_modal');
        JS.text= code;
        document.body.appendChild(JS);
    },

    exportExcel: function()
    {
        $(document).on( "click", ".app-export-excel-button", function(e){
            e.preventDefault();
            serializedForm = App.serializeForm($(this).closest('.app-content').find('form[set_filterform=1]')) + 'ajax=no&export=excel';

            if( App.platform === 'cordova' ){

                serializedForm = "'" + serializedForm + "'";

                $('<a style="display:none" href="javascript:void(0)" onclick="CordovaApp.openFile(' + serializedForm +', \'xls\')">ExportExcel</a>')
                    .appendTo($('body'))[0].click();

            }else{
                $('<a target="_blank" style="display:none" href="'+serializedForm+'">ExportExcel</a>')
                    .appendTo($('body'))[0].click();
            }
        });
    },

    __ : function(text)
    {
        return text;
    },

    runAllFunctions : function ()
    {
        $('.nav-tabs').tabdrop();

        Form.setAppAjaxForm();
        Form.setAppSelect2Ajax();
        Form.setAppSelect2();
        Form.setAppMultiSelect();
        Form.setAppAutoNumeric();
        Form.setAppDatePicker();
        Form.setAppTimePicker();
        Form.setAppTinymce();
        Form.setAppFullCalendar();
        Form.setYearPicker();
        Form.setColorPicker();
        Form.setAppDataTable();

        //app.setTab();
    }
};
