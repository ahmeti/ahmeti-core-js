const gulp = require('gulp');
const clean = require('gulp-clean');


gulp.task('DeleteFolderAndFiles', function () {
    return gulp.src([
        'resources/js',
        'resources/sass',
        'resources/views/auth',
        'rm resources/views/home.blade.php',
    ], {read: false})
        .pipe(clean());
});


gulp.task('CopyAuthAjaxRequest', function() {
    return gulp.src('vendor/ahmeti/core/app/Http/Middleware/AuthAjaxRequest.php')
        .pipe(gulp.dest('app/Http/Middleware/AuthAjaxRequest.php'));
});


gulp.task('init', [
    'DeleteFolderAndFiles',
    'CopyAuthAjaxRequest',
    'copy-data'
]);