var Form = {

    formSuccess : function(formEl, getJson)
    {
        // Change Item False
        App.changeItem=false;

        // Başarılı
        formEl.find("button[type='submit']")
            .parent()
            .prepend('<div class="alert alert-success" role="alert" style="margin-bottom:7px;padding:5px;border-width:3px">'+
                '<i class="fa fa-check-circle"></i> ' + getJson.msg + '</div>');

        if ( getJson.hasOwnProperty('jscode') && ! App.empty(getJson.jscode) ){
            setTimeout(function(){ App.addSinglePageJsCode(getJson.jscode); }, 30);
        }

        var hedef = App.getUrlParam('hedef', getJson.gourl);

        // KURALLAR...
        if ( getJson.output==='modal' && ! App.empty(getJson.gourl) && ! App.empty(getJson.hedef2) ){

            getJson.gourl=App.updateQueryString('output', 'modal', getJson.gourl);
            getJson.gourl=App.updateQueryString('hedef2', getJson.hedef2, getJson.gourl);
            setTimeout(function () { App.goAjaxUrl(getJson.gourl, false, '#'+getJson.hedef2); }, 600);
            // console.log('URL KURAL 1 - HEDEF2 (FORM İÇİN) ## ' + getJson.gourl);

        }else if ( ! App.empty(getJson.hedef) && getJson.output==='modal' && ! App.empty(getJson.gourl) ){

            getJson.gourl=App.updateQueryString('output', 'modal', getJson.gourl);
            getJson.gourl=App.updateQueryString('hedef', getJson.hedef, getJson.gourl);
            setTimeout(function () { App.goAjaxUrl(getJson.gourl, false, '#'+getJson.hedef); }, 600);
            // console.log('URL KURAL 2 - HEDEF (LİNK İÇİN) ## ' + getJson.gourl);

        }else if ( ! App.empty(hedef) ){

            setTimeout(function () { App.goAjaxUrl(getJson.gourl, false, '#'+hedef); }, 600);
            // console.log('URL KURAL 3 - LİNK PARAMETRESİNDE HEDEF BELİRTİLMİŞSE ÇALIŞIR. ## ' + getJson.gourl);

        }else if( ! App.empty(getJson.gourl) ){

            setTimeout(function () { App.goAjaxUrl(getJson.gourl); }, 600);
            // console.log('URL KURAL 4 - GO URL BOŞ DEĞİLSE ÇALIŞIR. ## ' + getJson.gourl);
        }

        // Modal Form İse Base Formu update et...
        if ( getJson.output=='modal' && ! App.empty(getJson.baseid) && ! App.empty(getJson.setdata) ){

            $.each(getJson.setdata, function(k, v) {

                // Select2 Ajax Base Form Update
                if ( ($('#'+getJson.baseid+' select[set_select2Ajax=1][name='+v.name+']').length > 0) ){
                    $('#'+getJson.baseid+' select[set_select2Ajax=1][name='+v.name+']').empty().append('<option value="'+v.id+'">'+v.value+'</option>').val(v.id).trigger('change');
                }

                // Select2 Base Form Update
                if ( ($('#'+getJson.baseid+' select[set_select2=1][name='+v.name+']').length > 0) ){

                    // Option varsa sil
                    $('#'+getJson.baseid+' select[set_select2=1][name='+v.name+'] option[value="'+v.id+'"]').remove();

                    $('#'+getJson.baseid+' select[set_select2=1][name='+v.name+']').append('<option value="'+v.id+'">'+v.value+'</option>').val(v.id).trigger('change');
                }
            });

            Form.setAppSelect2();
            Form.setAppSelect2Ajax();
        }

        // Hide Modal varsa modalı kapat...
        if ( getJson.output=='modal' && App.empty(getJson.gourl) ){
            setTimeout(function (){ $('#'+getJson.hedef.slice(0, -1)).modal('hide'); },400);

        }else if( getJson.output=='modal' && getJson.hidemodal==1 ){
            setTimeout(function (){ $('#'+getJson.hedef.slice(0, -1)).modal('hide'); },400);
        }
    },

    formError: function(formEl, getJson)
    {

        formEl.find("button[type='submit']").parent().prepend('<div class="alert alert-danger" role="alert" style="margin-bottom:7px;padding:5px;border-width:3px">'+
            '<i class="fa fa-exclamation-triangle"></i> ' + getJson.msg + '</div>');

        if ( ! App.empty(getJson.ename) ){

            customEl = formEl.find('[name="' + getJson.ename + '"]');

            customEl.parents('.form-group').addClass('has-error');

            customEl.closest('.errorMessage')
                .append('<p class="alert alert-danger ai-error-message" style="margin-bottom:7px;padding:5px;border-width:3px">'+
                    '<i class="fa fa-exclamation-triangle"></i> ' + getJson.msg + '</p>');
        }
    },

    setAppAjaxForm : function ()
    {
        selector = $('form[set_ajaxform=1]');

        if ( selector.length > 0 && jQuery().ajaxForm) {

            selector.each(function () {

                form_method = $(this).attr('method');

                $(this).attr('onkeypress', 'App.stopEnterSubmitting(window.event)');

                $(this).ajaxForm({

                    type: form_method ? form_method : 'post',

                    dataType: 'json',

                    beforeSerialize: function($form, options) {

                        // İşlemin devam etmesi için TRUE dönmelidir.
                        beforeSerializeFunc = form.attr('data-before-serialize');

                        if( App.empty(beforeSerializeFunc) ){
                            return true;
                        }else{
                            beforeSerializeFuncParams = beforeSerializeFunc.split(".");
                            objectName = beforeSerializeFuncParams[0];
                            methodName = beforeSerializeFuncParams[1];
                            return window[objectName][methodName]($form, options);
                        }
                    },

                    beforeSubmit: function (formData, form, options) {

                        // Submit Button Start Loading...
                        submitEl = form.find("button[type='submit']");
                        submitEl.find('.fa').show();
                        submitEl.find('.butonLabel').text( submitEl.attr('data-loading-text') );
                        submitEl.prop("disabled", true);

                        // İşlemin devam etmesi için TRUE dönmelidir.
                        beforeSubmitFunc = form.attr('data-before-submit');

                        if( App.empty(beforeSubmitFunc) ){
                            return true;
                        }else{
                            beforeSubmitFuncParams = beforeSubmitFunc.split(".");
                            objectName = beforeSubmitFuncParams[0];
                            methodName = beforeSubmitFuncParams[1];
                            return window[objectName][methodName](formData, form, options);
                        }
                    },

                    complete: function (xhr, textStatus, form) {

                        try {
                            getJson = JSON.parse(xhr.responseText);
                        }catch(e){
                            getJson = { status: "no", msg: "Bir hata oluştu. Lütfen tekrar deneyiniz." };
                        }

                        // Hata olan elemenleri temizler
                        form.find('div.form-group').each(function () {
                            $(this).removeClass('has-error');
                        });
                        form.find('p.ai-error-message').each(function () {
                            $(this).remove();
                        });
                        form.find('div.alert').each(function () {
                            $(this).remove();
                        });


                        // Submit Button Finish Loading...
                        submitEl = form.find("button[type='submit']");
                        submitEl.find('.fa').hide();
                        submitEl.find('.butonLabel').text( submitEl.attr('data-normal-text') );
                        submitEl.prop("disabled", false);

                        setTimeout(function () {
                            if (getJson.status == 'yes') {
                                Form.formSuccess(form, getJson);

                            }else{
                                Form.formError(form, getJson);
                            }
                        }, 50);

                    }
                });
            });
        }
    },

    setAppSelect2Ajax : function()
    {
        if ( $('select[set_select2Ajax=1]').length > 0 && jQuery().select2 ){

            $('select[set_select2Ajax=1]').each(function() {
                var ajaxUrl=$(this).attr('ajaxUrl');
                var ph=$(this).attr("placeholder");
                var rows=Number($(this).attr("oprows"));
                var template=$(this).attr("app-template");
                var multiple=$(this).attr("multiple");
                var app_class=( App.empty($(this).attr("app-class")) ? "" : $(this).attr("app-class"));
                var fulllist=( Number($(this).attr("fulllist")) == 1 ? 0 : 2 );
                var tags=$(this).attr("app-tags");

                $select2=$(this).select2({
                    width: '100%',
                    //theme: "bootstrap",
                    allowClear: (App.empty(multiple) ? true : false),
                    placeholderValue: '',
                    placeholder: ph,
                    ajax: {
                        url: ajaxUrl,
                        dataType: 'json',
                        delay: 500,
                        data: function (params) {
                            var query = {
                                search: params.term, // search term
                                page: params.page
                            };
                            return query;
                        },
                        processResults: function (data, page) {
                            // parse the results into the format expected by Select2.
                            // since we are using custom formatting functions we do not need to
                            // alter the remote JSON data
                            return {
                                results: data.items
                            };
                        },
                        cache: true
                    },

                    tags:(App.empty(tags) ? false : true),

                    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
                    minimumInputLength: fulllist,
                    templateResult: function (item) {
                        if(!item.id) {
                            // return `text` for optgroup
                            return item.text;
                        }

                        if (rows > 0 && item.text){
                            // return item template
                            var index=0, len=0, newItem=0, sItem;
                            sItem=item.text.split("|||");
                            len=sItem.length;

                            for (index = 0; index < len; index++) {

                                if (index==0 && !App.empty(sItem[index])){
                                    newItem='<span style="display:block;font-weight:bold">' + sItem[index] + '</span>';
                                }else if( !App.empty(sItem[index]) ){
                                    newItem+='<span style="display:block;font-size:11px">' + sItem[index] + '</span>';
                                }
                            }
                            return '<div class="select2-opt-row">' + newItem + '</div>';

                        }else if(template == 'Advanced'){
                            var sonuc='<div class="select2-opt-row" data-tur="'+item.tur+'" data-url="'+item.url+'">';
                            if(item.tur=='1'){ sonuc+='<span class="label label-primary label-mustericari">Sayfa</span> '; }
                            if(item.tur=='3'){ sonuc+='<span class="label label-info label-mustericari">Kontak</span> '; }
                            if(item.tur=='2' && item.cari=='y'){ sonuc+='<span class="label label-success label-mustericari">CARİ</span> '; }
                            if(item.tur=='2' && item.cari=='n'){ sonuc+='<span class="label label-warning label-mustericari">CRM</span> '; }
                            return sonuc+item.text+'</div>';

                        }else if(template == 'Musteri'){
                            if(item.cari=='y'){
                                return '<span class="label label-success label-mustericari">CARİ</span> '+item.text;
                            }
                            return '<span class="label label-warning label-mustericari">CRM</span> '+item.text;

                        }else if(template == 'KontakMail'){
                            if( ! App.empty(item.mail2) ){ return '<span class="mr-opt1">' + item.text + '</span><span class="mr-opt2">' + item.mail2 + '</span>'; }
                            if( ! App.empty(item.mail1) ){ return '<span class="mr-opt1">' + item.text + '</span><span class="mr-opt2">' + item.mail1 + '</span>'; }
                            if( ! App.empty(item.mail3) ){ return '<span class="mr-opt1">' + item.text + '</span><span class="mr-opt2">' + item.mail3 + '</span>'; }
                            return '<span class="mr-opt1">' + item.text + '</span><span class="mr-opt2">E-Posta adresi yok.</span>';

                        }else if(template == 'Contact'){

                            data = '<span class="mr-opt1">' + item.text + '</span>';
                            data2 = [];

                            if( item.title && item.title.length > 0 ){ data2.push(item.title); }
                            if( item.email2 && item.email2.length > 0 ){ data2.push(item.email2); }
                            if( item.email1 && item.email1.length > 0 ){ data2.push(item.email1); }
                            if( item.email3 && item.email3.length > 0 ){ data2.push(item.email3); }

                            if( data2.length > 0 ){
                                data += '<span style="display:block;font-size:11px">' + data2.join(' - ') + '</span>';
                            }
                            return data;

                        }else if(template == 'Urun'){
                            return '<span class="mr-opt1">' + item.text + '</span><span class="mr-opt2">' + item.stock_code + '</span>';
                        }else{
                            // return item template
                            return item.text;
                        }
                    },
                    templateSelection:  function (item) {

                        if (rows > 0){
                            // Birden çok satır varsa...
                            sItem=item.text.split("|||");
                            return sItem[0];
                        }else{

                            if(template == 'Urun'){
                                return item.stock_code || item.text;
                            }

                            // return item template
                            return item.text;
                        }
                    }
                });

                $select2.data('select2').$container.addClass((App.empty(multiple) ? (App.empty(app_class) ? 'app-select2-single' : app_class) : (App.empty(app_class) ? 'app-select2-multiple' : app_class) ));
                $select2.data('select2').$dropdown.addClass((App.empty(multiple) ? (App.empty(app_class) ? 'app-select2-single' : app_class) : (App.empty(app_class) ? 'app-select2-multiple' : app_class) ));
            });
        }
    },

    setAppSelect2 : function()
    {
        if ( ($('select[set_select2=1]').length > 0) ){

            if (jQuery().select2){
                $('select[set_select2=1]').each(function() {

                    var ph=$(this).attr("placeholder");
                    var allowClear=$(this).attr("allow-clear");
                    allowClear = allowClear ? true : false;
                    var di=$(this).attr('data-icon');
                    var multiple=$(this).attr("multiple");
                    var hidesearch=$(this).attr("app-hide-search");
                    var app_class=( App.empty($(this).attr("app-class")) ? "" : " "+$(this).attr("app-class"));
                    app_class+=(App.empty(hidesearch) ? '' : ' hide-search');

                    if (App.empty(di)){
                        $select2=$(this).select2({
                            width: '100%',
                            allowClear: allowClear,
                            placeholderValue: '',
                            placeholder: ph,
                            minimumResultsForSearch: (App.empty(hidesearch) ? 2 : Infinity)
                            //theme: "bootstrap"
                        });

                        $select2.data('select2').$container.addClass((App.empty(multiple) ? 'app-select2-single'+app_class : 'app-select2-multiple'+app_class));
                        $select2.data('select2').$dropdown.addClass((App.empty(multiple) ? 'app-select2-single'+app_class : 'app-select2-multiple'+app_class));

                    }else{
                        $select2=$(this).select2({
                            width: '100%',
                            allowClear: allowClear,
                            placeholderValue: '',
                            placeholder: ph,
                            minimumResultsForSearch: (App.empty(hidesearch) ? 2 : Infinity),
                            //theme: "bootstrap",
                            templateResult: Form.select2OptionTemplate,
                            templateSelection : Form.select2OptionTemplate
                        });
                        $select2.data('select2').$container.addClass((App.empty(multiple) ? 'app-select2-single'+app_class : 'app-select2-multiple'+app_class));
                        $select2.data('select2').$dropdown.addClass((App.empty(multiple) ? 'app-select2-single'+app_class : 'app-select2-multiple'+app_class));

                        //$select2.data('select2').$container.addClass((App.empty(multiple) ? (App.empty(app_class) ? 'app-select2-single' : app_class) : (App.empty(app_class) ? 'app-select2-multiple' : app_class) ));
                        //$select2.data('select2').$dropdown.addClass((App.empty(multiple) ? (App.empty(app_class) ? 'app-select2-single' : app_class) : (App.empty(app_class) ? 'app-select2-multiple' : app_class) ));
                    }

                });
            }
        }
    },

    select2OptionTemplate : function(state)
    {
        if (!state.id) { return state.text; }

        var $opt= $(state.element);
        var img_icon=$opt.attr('data-icon');
        var icon_color=$opt.attr('data-icon-color');

        if (App.empty(icon_color)){
            icon_color='';
        }else{
            icon_color=' style="color:'+icon_color+'"';
        }

        var $state = $(
            '<span><i'+icon_color+' class="'+img_icon+'"></i>&nbsp;&nbsp;' + state.text + '</span>'
        );

        return $state;
    },

    setAppMultiSelect : function()
    {
        if ( ($('select[set_multiselect=1]').length > 0) ){

            if (jQuery().multiselect){
                $('select[set_multiselect=1]').each(function() {

                    var name=$(this).attr('data-name');
                    var label=$(this).attr('data-label');
                    ulclass=$(this).attr('data-ulclass');
                    ulclass = ulclass ? ' ' + ulclass : '';

                    $(this).multiselect({
                        maxHeight: 200,
                        checkboxName: name,
                        buttonClass: 'btn btn-default btn-sm',
                        buttonWidth:'100%',
                        buttonText: function(options, select) {
                            if (options.length > 0){

                                return options.length + ' öğe seçili';

                                var labels = [];
                                options.each(function() {
                                    if ($(this).attr('label') !== undefined) {
                                        labels.push($(this).attr('label'));
                                    }
                                    else {
                                        labels.push($(this).html());
                                    }
                                });
                                return labels.join(', ') + '';
                            }else{
                                return label;
                            }
                        },
                        includeSelectAllOption: true,
                        selectAllText: 'Hepsi',
                        templates: {
                            ul: '<ul class="multiselect-container dropdown-menu dataTableDropDown'+ulclass+'"></ul>',
                            //li: '<li><a href="javascript:void(0);"><label></label></a></li>',
                        }

                    });
                });
            }
        }
    },

    setAppAutoNumeric : function()
    {
        if ( ($('input[set_autonumeric=1]').length > 0) ){

            if (jQuery().autoNumeric){
                $('input[set_autonumeric=1]').each(function() {
                    $(this).autoNumeric('init');
                });
            }
        }
    },

    setAppDatePicker : function()
    {
        if ( ($('input[set_datepicker=1]').length > 0) ){

            if (jQuery().datepicker){

                $('input[set_datepicker=1]').each(function() {

                    options = {
                        language: "tr",
                        keyboardNavigation: false,
                        forceParse: false,
                        todayHighlight: true,
                        format: "dd.mm.yyyy",
                        autoclose: true,
                        orientation: "bottom left"
                    };

                    if( $(this).data('app-start-date') ){
                        options.startDate = $(this).data('app-start-date');
                    }

                    if( $(this).data('app-end-date') ){
                        options.endDate = $(this).data('app-end-date');
                    }

                    $(this).datepicker(options);
                });
            }
        }
    },

    setAppTimePicker : function()
    {
        if ( ($('input[set_timepicker=1]').length > 0) ){

            $('input[set_timepicker=1]').each(function() {

                //console.log('geldi');

                $(this).timepicker({
                    defaultTime: false,
                    showMeridian:false
                });

            });
        }
    },

    setAppTinymce : function()
    {
        while (tinymce.editors.length > 0) {
            tinymce.remove(tinymce.editors[0]);
        }

        if ( ($('textarea[set_tinymce=1]').length > 0) ){

            $('textarea[set_tinymce=1]').each(function() {

                tinymce.init({
                    selector: 'textarea#'+$(this).attr('id'),
                    plugins: "textcolor code paste",
                    forced_root_block : "",
                    menubar: false,
                    statusbar:false,
                    toolbar_items_size: 'small',
                    entity_encoding : "raw",
                    paste_as_text: true,
                    toolbar: 'fontsizeselect bold italic underline forecolor backcolor removeformat code', //alignleft aligncenter alignright
                    fontsize_formats: "6pt 7pt 8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt",
                    setup: function (editor) {
                        editor.on('change', function () {
                            tinymce.triggerSave();
                        });
                    }
                });
            });
        }
    },

    setAppFullCalendar : function()
    {
        if ( ($('div[set_calendar=1]').length < 1) || App.empty($.fn.fullCalendar) ) {
            return false;
        }
        $('div[set_calendar=1]').each(function() {

            $(this).fullCalendar({
                eventLimit: true,
                contentHeight: NaN,
                timezone:'Europe/Istanbul',

                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'year,month,agendaWeek,agendaDay,listWeek'
                },

                events: {
                    url: $(this).attr('data-url')
                },

                eventRender: function(event, element) {

                    $(element).attr('title', event.description);

                    viewName = event.source.calendar.view.name;

                    if( viewName === 'listWeek' ){
                        $(element).closest('.fc-list-item').removeClass().addClass('fc-list-item');
                        $(element).find('a').addClass('app-process').text(event.description);
                    }
                }
            });
        });
    },

    setYearPicker : function()
    {
        if ( ($('input[data-app-yearpicker=1]').length > 0 && jQuery().datepicker) ){

            $('input[data-app-yearpicker=1]').each(function() {

                $(this).datepicker({
                    language: "tr",
                    keyboardNavigation: false,
                    forceParse: false,
                    format: "yyyy",
                    autoclose: true,
                    viewMode: "years",
                    minViewMode: "years",
                    orientation: "bottom left"
                });
            });
        }
    },

    setColorPicker : function(selector)
    {
        if( ! jQuery().colorPicker ){
            return false;
        }

        if( typeof selector === 'string' ){
            selector = $(selector);
        }else if(typeof selector === 'object' && selector !== null){
            // continue
        }else{
            selector = $("input[data-app-colorpicker='1']");
        }

        if ( selector.length < 1 ){
            return false;
        }

        selector.each(function() {
            $(this).colorPicker();
        });
    },

    setAppDataTable : function()
    {
        if ( ($('table[data-app-datatable=1]').length > 0 && jQuery().DataTable) ){

            $('table[data-app-datatable=1]').each(function() {

                if ( $(this).attr('data-app-init') != "1" ){

                    $(this).attr('data-app-init', 1);

                    var isFullTable = $(this).data('fulldatatable');
                    var orderColumnName = $(this).data('order-column');
                    var orderType = $(this).data('order-type');
                    var orderColumnIndex = $(this).find('[data-name="'+orderColumnName+'"]');
                    orderColumnIndex = orderColumnIndex.length > 0 ? orderColumnIndex[0].cellIndex : 0;
                    orderType = orderType ? orderType : 'desc';

                    datatableOptions = {
                        ordering: true,
                        paging: false,
                        searching: false,
                        info: false,
                        order: orderColumnName ? [[ orderColumnIndex, orderType ]] : []
                    };

                    if( App.isMobile ){
                        // Mobile ise tüm satırları aç.
                        datatableOptions.responsive = {
                            details: {
                                display: $.fn.dataTable.Responsive.display.childRowImmediate,
                                type: ''
                            }
                        };
                    }else{
                        datatableOptions.scrollX = true;
                    }

                    var table = $(this).DataTable(datatableOptions);

                    table.on('order.dt', function (data) {
                        if ( isFullTable !== 1 ){

                            var order = table.order();
                            var column = order[0][0];
                            var orderType = order[0][1];

                            var header = table.column(column).header();
                            var orderColumn = $(header).data('name');

                            var filterId = $(table.settings()[0].nTable).data('appFilterid');

                            if (filterId){
                                $('#'+filterId).find('input[name=orderByCol]').val(orderColumn)
                                $('#'+filterId).find('input[name=orderByType]').val(orderType)
                                table.destroy();
                                $('#'+filterId).find('.filterFormButton').trigger('click');
                            }
                        }
                    });
                }
            });
        }
    },

    cleanForm : function(form_id)
    {
        if ( ($('form#'+form_id).length > 0 ) ){

            $('form#'+form_id+' div.alert').remove();
            $('form#'+form_id+' p.ai-error-message').remove();

            $('form#'+form_id+' div.has-error').each(function() {
                $(this).removeClass('has-error');
            });
        }
    }
};