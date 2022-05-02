import gulp from 'gulp'
import merge from 'merge-stream'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import concat from 'gulp-concat'
import through from 'through2'
import VinylFile from 'vinyl'
import path from 'path'

const S = gulpSass(sass)
const REGISTRIES = ['items', 'monsters', 'mods']

function buildStyles(){
  return gulp.src('./client/styles/**/*.*ss')
    .pipe(S().on('error', S.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./client_dist/styles'))
}

function copyAssets(){
  return gulp.src('./client/assets/**/*')
    .pipe(gulp.dest('./client_dist/assets'))
}

function generateRegistries(){
  const pipes = REGISTRIES.map(t => {
    return gulp.src('./game/' + t + '/*/**/*.js')
      .pipe(exporterConcater('./game/' + t + '/combined.js'))
      .pipe(gulp.dest('.'))
  })
  return merge(...pipes)
}

function exporterConcater(targetFile){
  const files = []

  return through.obj(function(file, encoding, callback){
    if(!file.isNull()){
      files.push({
        path: path.relative(path.dirname(targetFile), file.path).split(path.sep).join(path.posix.sep),
        name: toClassName(path.basename(file.path))
      })
    }
    callback()
  }, function(callback){
    if(!files.length){
      return callback()
    }
    let outputFile = new VinylFile()
    outputFile.path = path.resolve(outputFile.base, targetFile)
    outputFile.contents = Buffer.from(combinedFileContents())
    this.push(outputFile)
    callback()
  })

  function combinedFileContents(){
    let str = ''
    files.forEach(file => {
      str += `import ${file.name} from './${file.path}'\n`
      str += `${file.name}.name = '${file.name}'\n`
    })
    str += `export default { ${files.map(file => `${file.name.toUpperCase()}:${file.name}`).join(',')} }`
    return str
  }
}

export const watch =  () => {
  gulp.watch('./client/styles/**/*.sass', { ignoreInitial: false }, buildStyles)
  gulp.watch('./client/assets/**/*', { ignoreInitial: false }, copyAssets)
  gulp.watch(['./game/*/**/*.js', '!./game/**/combined.js'], { ignoreInitial: false }, generateRegistries)
}

export const build = gulp.series(buildStyles, copyAssets, generateRegistries)

function toClassName(filename){
  return filename.split('.')[0]
}