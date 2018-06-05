var gulp = require('gulp');
var concat = require('gulp-concat');
var scripts = [
  './src/intro.js',
  './src/polyfills.js',
  './src/game.js',
  './src/loop.js',
  './src/pool.js',
  './src/signal.js',
  './src/state.js',
  './src/stateManager.js',
  './src/outro.js'
];

gulp.task('concat-dist', function () {
  gulp.src(scripts)
    .pipe(concat('cherry.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('concat-test', function () {
  gulp.src(scripts)
    .pipe(concat('cherry.js'))
    .pipe(gulp.dest('./tests/manual'));
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['concat-dist', 'concat-test']);
});
