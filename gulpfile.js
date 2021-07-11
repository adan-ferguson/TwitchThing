const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')

function buildStyles() {
  return gulp.src('./client/styles/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./client_dist/styles'))
}

function copyAssets(){
  return gulp.src('./client/assets/**/*')
    .pipe(gulp.dest('./client_dist/assets'))
}

exports.watch = () => {
  gulp.watch('./client/styles/**/*.sass', { ignoreInitial: false },function(cb){
    buildStyles()
    cb()
  })
  gulp.watch('./client/assets/**/*', { ignoreInitial: false },function(cb){
    copyAssets()
    cb()
  })
}

exports.default = gulp.series(buildStyles, copyAssets)