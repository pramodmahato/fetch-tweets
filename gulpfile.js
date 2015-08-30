
/* Require the node modules */
var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var coffee  = require('gulp-coffee');
var lint    = require('gulp-coffeelint');
var del     = require('del');
var footer  = require('gulp-footer');
var size    = require('gulp-size');
var mocha   = require('gulp-mocha');
var istanbul= require('gulp-istanbul');
var watch   = require('gulp-watch');
require('coffee-script/register');


/* Delete the files currently in lib directory */
gulp.task('clean', function (cb) {
    del(['./lib/**/*.js'], cb);
});

/* Lint, compile and minify CoffeeScript */
gulp.task('coffee-script', ['clean'],  function(){
    return gulp.src('./src/**/*.coffee')
        .pipe(lint())
        .pipe(lint.reporter())
        .pipe(coffee())
        .pipe(uglify())
        .pipe(footer(''))
        .pipe(size())
        .pipe(gulp.dest('lib'))
});

/* Run unit tests and generate coverage report */
gulp.task('test', function (cb) {
    gulp.src(['./src/**/*.coffee'])
        .on('finish', function () {
            gulp.src('./test/**/*.coffee', {read: false})
                .pipe(mocha({
                    reporter: 'mochawesome',
                    reporterOptions: {
                        reportDir: './reports/unit-test-report',
                        reportName: 'results',
                        reportTitle: 'fetch-tweets-test-results'
                    }
                }))
                .pipe(istanbul.writeReports({dir: './reports/coverage-reports'}))
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
                .on('end', cb);
        });
});

/* Watch for changes and refresh */
gulp.task('watch', function(){
    gulp.watch('./src/**/*.coffee', ['coffee-script', 'test']);
    gulp.watch('./test/**/*.coffee', ['test']);
});

/* Defualt gulp task, deletes old files, compiles source files and runs tests */
gulp.task('default', ['coffee-script', 'watch']);