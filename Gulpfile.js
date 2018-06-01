var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function () {
  gulp.src([
    './src/intro.js',
    './src/object-pool.js',
    './src/game-loop.js',
    './src/outro.js'
  ])
    .pipe(concat('comp.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['concat']);
});