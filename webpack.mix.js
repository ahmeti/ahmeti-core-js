let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.copy('node_modules/font-awesome/fonts', 'dist/fonts');
mix.copy('node_modules/datatables.net-dt/images', 'dist/images');

// ###########################################################################

mix.scripts([

    // FRONT - SB-ADMIN THEME JS
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',

], 'dist/js/front.js').setPublicPath('dist').version();

mix.styles([

    // FRONT - SB-ADMIN THEME CSS
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'resources/themes/sb-admin/sb-admin.css',

], 'dist/css/front.css').setPublicPath('dist').version();

// ###########################################################################

mix.scripts([

    // AUTH - SB-ADMIN THEME JS
    'node_modules/jquery/dist/jquery.min.js',

    'node_modules/bootstrap/dist/js/bootstrap.min.js',

    'node_modules/metismenu/dist/metisMenu.min.js',

    'node_modules/select2/dist/js/select2.full.min.js',
    'node_modules/select2/dist/js/i18n/tr.js',

    'node_modules/bootbox/bootbox.min.js',

    'node_modules/sweetalert2/dist/sweetalert2.all.min.js',

    'node_modules/autonumeric/autoNumeric-min.js',

    'node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
    'node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.tr.min.js',

    'node_modules/bootstrap-multiselect/dist/js/bootstrap-multiselect.js',

    'node_modules/chart.js/dist/Chart.min.js',

    'node_modules/moment/min/moment.min.js',

    'node_modules/fullcalendar/dist/fullcalendar.min.js',
    'node_modules/fullcalendar/dist/locale/tr.js',

    'node_modules/bootstrap-timepicker/js/bootstrap-timepicker.min.js',

    'node_modules/tinymce/tinymce.min.js',
    'node_modules/tinymce/jquery.tinymce.min.js',
    'node_modules/tinymce/plugins/textcolor/plugin.min.js',
    'node_modules/tinymce/plugins/paste/plugin.min.js',
    'node_modules/tinymce/themes/modern/theme.min.js',
    'node_modules/tinymce/plugins/code/plugin.min.js',

    'node_modules/bootstrap-tabdrop-ro/js/bootstrap-tabdrop.js',

    'node_modules/datatables.net/js/jquery.dataTables.min.js',
    'node_modules/datatables.net-responsive/js/dataTables.responsive.min.js',
    'node_modules/datatables.net-responsive-dt/js/responsive.dataTables.min.js',

    'node_modules/history.js/history.adapter.ender.js',
    'node_modules/history.js/history.js',

    'node_modules/jquery-form/dist/jquery.form.min.js',

    'js/1-app.js',
    'js/2-form.js',
    'js/3-init.js',

], 'dist/js/auth.js').setPublicPath('dist').version();


mix.styles([

    // AUTH - SB-ADMIN THEME CSS
    'node_modules/bootstrap/dist/css/bootstrap.min.css',

    'css/metismenu.css',

    'node_modules/sweetalert2/dist/sweetalert2.min.css',
    'css/sweetalert2.css',

    'node_modules/font-awesome/css/font-awesome.min.css',

    'node_modules/select2/dist/css/select2.min.css',
    'css/select2.css',

    'node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css',

    'node_modules/bootstrap-multiselect/dist/css/bootstrap-multiselect.css',

    'node_modules/fullcalendar/dist/fullcalendar.min.css',

    'node_modules/datatables.net-dt/css/jquery.dataTables.min.css',
    'node_modules/datatables.net-responsive-dt/css/responsive.dataTables.min.css',

    'css/timeline.css',

    'css/sb-admin.css',

    'css/datatable.css',

    'css/bootstrap-multiselect.css',

    'css/tinymce.css',

    'css/helpers.css'

], 'dist/css/auth.css').setPublicPath('dist').version();
