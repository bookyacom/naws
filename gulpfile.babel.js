import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import sourcemaps from 'gulp-sourcemaps';

var config = {
  paths: {
    js: {
      src: 'lib/**/*.js',
      dist: 'dist/'
    },
    test: {
      src: 'test/**/*.js',
      dist: 'test-dist/',
      run: 'test-dist/*.js'
    }
  }
};

let options = {
  presets : ['es2015'],
  plugins : ['transform-runtime']
};

gulp.task('build', ['build-src', 'build-test']);

gulp.task('build-src', () =>
  gulp.src(config.paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(babel(options))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.js.dist))
);

gulp.task('build-test', () =>
  gulp.src(config.paths.test.src)
    .pipe(sourcemaps.init())
    .pipe(babel(options))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.test.dist))
);

gulp.task('watch', () => {
  gulp.watch(config.paths.js.src, ['build-src', 'test']);
  gulp.watch(config.paths.test.src, ['build-test', 'test']);
});

gulp.task('test', ['build'], () =>
  gulp.src([config.paths.test.run])
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', err => console.log(err.stack))
);

// Default Task
gulp.task('default', ['build', 'test']);