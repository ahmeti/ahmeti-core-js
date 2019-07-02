const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');

gulp.task('MoveFolderAndFiles', function() {
    return gulp.src([
        'app/User.php'
    ])
        .pipe(gulp.dest('app/Modules/User/Models/'));
});

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
        'app/User.php'
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

gulp.task('init', [
    'MoveFolderAndFiles',
    'DeleteFolderAndFiles',
    'CopyAuthAjaxRequest',
    'CopyCoreCss',
    'CopyCoreJs',
    'CopyCoreFonts',
    'CopyCoreImages',
    'CopyWebpackSample'
]);