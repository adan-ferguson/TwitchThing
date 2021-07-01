const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))

function buildStyles() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client_dist/style.css'))
}

exports.default = () => {
  gulp.watch('./client/sass/**/*.sass', { ignoreInitial: false }, buildStyles)
}