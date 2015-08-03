'use strict';

var gulp = require('gulp');


var src = './src/assets/**/*',
  dist = './dist/assets/';

function index() {
  return gulp.src(src)
    .pipe(gulp.dest(dist));
}


gulp.task('build-assets', index);
