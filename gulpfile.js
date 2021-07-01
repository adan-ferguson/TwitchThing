const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')

function buildStyles() {
  return gulp.src('./client/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./client_dist'))
}

exports.default = () => {
  gulp.watch('./client/sass/**/*.sass', { ignoreInitial: false },function(cb){
    buildStyles()
    cb()
  })
}