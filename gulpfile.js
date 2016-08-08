var gulp = require('gulp');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

gulp.task('js-hint', function () {
  gulp.src('./_js/*.js')
    .pipe(plumber(plumberErrorHandler))
    .pipe(jshint())
    .pipe(jshint.reporter('fail'))
    .pipe(notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success
        return false;
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));
});

gulp.task('js-vendor', function () {
  gulp.src([
      './node_modules/jquery/dist/jquery.js',
      './node_modules/jquery.marquee/jquery.marquee.js',
      './node_modules/gsap/src/uncompressed/easing/EasePack.js',
      './node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js',
      './node_modules/gsap/src/uncompressed/TweenMax.js'
    ])
    .pipe(concat('./js/vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('js-custom', function () {
  gulp.src('./_js/*.js')
    .pipe(plumber(plumberErrorHandler))
    // .pipe(uglify())
    .pipe(rename('site.min.js'))
    .pipe(gulp.dest('./js/'));
});

var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
  })
};

gulp.task('watch', function() {
  gulp.watch('./_js/*.js', ['js-hint', 'js-custom']);
  // gulp.watch('./static/img/*.{png,jpg,gif}', ['img']);
});

gulp.task('default', ['js-hint', 'js-vendor', 'js-custom', 'watch']);