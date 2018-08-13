var gulp = require('gulp');
var concat = require('gulp-concat');
var scripts = [
  './src/polyfills.js',
  './src/calc.js',
  './src/canvas.js',
  './src/game.js',
  './src/inputs.js',
  './src/loader.js',
  './src/loop.js',
  './src/pool.js',
  './src/signal.js',
  './src/state.js',
  './src/stateManager.js',
  './src/outro.js'
];

gulp.task('concat-dist', function () {
  gulp.src(scripts)
    .pipe(concat('naive.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('concat-docs', function () {
  gulp.src(scripts)
    .pipe(concat('naive.js'))
    .pipe(gulp.dest('./docs/scripts'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['concat-dist', 'concat-docs']);
});
