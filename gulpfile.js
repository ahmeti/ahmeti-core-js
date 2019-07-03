const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const gulpSequence = require('gulp-sequence');

gulp.task('DeleteFolderAndFiles', function () {
    return gulp.src([
        'resources/js',
        'resources/sass',
        'resources/views/auth',
        'resources/views/home.blade.php',
        'resources/views/welcome.blade.php',
        'public/css',
        'public/js',
        'resources/views/layouts/app.blade.php',
        'app/User.php',
        'app/Http/Controllers/Auth',
        'app/Http/Controllers/HomeController.php'
    ], {read: false})
        .pipe(clean());
});

gulp.task('CopyAuthAjaxRequest', function () {
    return gulp.src([
        'vendor/ahmeti/core/app/Http/Middleware/AuthAjaxRequest.php'
    ]).pipe(gulp.dest('app/Http/Middleware'));
});

gulp.task('CopyCoreCss', function () {
    return gulp.src([
        'node_modules/ahmeti-core-js/dist/css/**'
    ]).pipe(gulp.dest('public/css'));
});

gulp.task('CopyCoreJs', function () {
    return gulp.src([
        'node_modules/ahmeti-core-js/dist/js/**'
    ]).pipe(gulp.dest('public/js'));
});

gulp.task('CopyCoreFonts', function () {
    return gulp.src([
        'node_modules/ahmeti-core-js/dist/fonts/**'
    ]).pipe(gulp.dest('public/fonts'));
});

gulp.task('CopyCoreImages', function () {
    return gulp.src([
        'node_modules/ahmeti-core-js/dist/images/**'
    ]).pipe(gulp.dest('public/images'));
});

gulp.task('CopyWebpackSample', function () {
    return gulp.src('node_modules/ahmeti-core-js/webpack.mix.sample')
        .pipe(rename('webpack.mix.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('CopyModules', function () {
    return gulp.src('vendor/ahmeti/core/app/Modules/**')
        .pipe(gulp.dest('app/Modules'));
});

gulp.task('CopyCoreFacades', function () {
    return gulp.src([
        'vendor/ahmeti/core/app/Core.php',
        'vendor/ahmeti/core/app/Form.php',
        'vendor/ahmeti/core/app/Response.php',
    ]).pipe(gulp.dest('app'));
});

gulp.task('CopyWebRoutes', function () {
    return gulp.src([
        'vendor/ahmeti/core/routes/web.php',
    ]).pipe(gulp.dest('routes'));
});

gulp.task('CopyViewLayouts', function () {
    return gulp.src([
        'vendor/ahmeti/core/resources/views/layouts/auth.blade.php',
        'vendor/ahmeti/core/resources/views/layouts/front.blade.php',
    ]).pipe(gulp.dest('resources/views/layouts'));
});

gulp.task('CopyViewVendorPagination', function () {
    return gulp.src([
        'vendor/ahmeti/core/resources/views/vendor/pagination/default.blade.php',
        'vendor/ahmeti/core/resources/views/vendor/pagination/simple-default.blade.php',
    ]).pipe(gulp.dest('resources/views/vendor/pagination'));
});


gulp.task('init', gulpSequence(
    'DeleteFolderAndFiles',
    'CopyAuthAjaxRequest',
    'CopyCoreCss',
    'CopyCoreJs',
    'CopyCoreFonts',
    'CopyCoreImages',
    'CopyWebpackSample',
    'CopyModules',
    'CopyCoreFacades',
    'CopyWebRoutes',
    'CopyViewLayouts',
    'CopyViewVendorPagination'
));