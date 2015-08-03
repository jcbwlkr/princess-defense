var gulp = require('gulp');


require('./build/scripts');
require('./build/index');
require('./build/assets');


gulp.task('build', ['build-scripts', 'build-index', 'build-assets']);
