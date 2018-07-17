var gulp = require('gulp');
var concat = require('gulp-concat');
var scripts = [
  './src/polyfills.js',
  './src/calc.js',
  './src/canvas.js',
  './src/game.js',
  './src/loader.js',
  './src/loop.js',
  './src/pool.js',
  './src/signal.js',
  './src/state.js',
  './src/stateManager.js',
  './src/outro.js'
];

gulp.task('concat', function () {
  gulp.src(scripts)
    .pipe(concat('naive.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['concat']);
});
