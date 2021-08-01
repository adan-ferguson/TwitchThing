import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import sass from 'sass'
import concat from 'gulp-concat'
import through from 'through2'
import VinylFile from 'vinyl'
import path from 'path'

const S = gulpSass(sass)

function buildStyles() {
  return gulp.src('./client/styles/**/*.sass')
    .pipe(S().on('error', S.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./client_dist/styles'))
}

function copyAssets(){
  return gulp.src('./client/assets/**/*')
    .pipe(gulp.dest('./client_dist/assets'))
}

function generateItemRegistry(){
  return gulp.src('./game/items/*/**/*.js')
    .pipe(exporterConcater('./game/items/combined.js'))
    .pipe(gulp.dest('.'))
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
    })
    str += `export default { ${files.map(file => file.name).join(',')} }`
    return str
  }
}

// function generateItemRegistry(){
//
//   const data = []
//   const basePath = path.join('game/items/', categoryName, 'definitions')
//   readDir()
//   const contents = generateLoaderCode(getConfig(categoryName), data)
//   fs.writeFileSync(path.join(DATA_PATH, categoryName, 'definitionLoader.ts'), contents)
//
//   console.log(`Definition Loader for ${categoryName} compiled.`)
//
//   function readDir(subdirs = []){
//     const files = fs.readdirSync(path.join(basePath, ...subdirs))
//     files.forEach(filename => {
//       const name = filename.replace(/\.[^/.]+$/, '')
//       const filepath = path.join(basePath, ...subdirs, filename)
//       if(fs.lstatSync(filepath).isDirectory()) {
//         readDir([...subdirs, name])
//       }else{
//         data.push({
//           name: name,
//           categories: subdirs
//         })
//       }
//     })
//   }
// }
//
//
// function generateLoaderCode(config, data){
// //   return `import { DataCollection } from 'game/data/dataCollection'
// // import { ${config.interfaceName} } from '${config.interfacePath}'
// // ${data.map(d => `import { ${d.name} } from './definitions/${d.categories.join('/')}/${d.name}'`).join('\n')}
// //
// // type ${config.className}ID = ${data.map(d => `'${d.name}'`).join(' | ')}
// //
// // const ${config.className}Definitions = new DataCollection<${config.className}ID, ${config.interfaceName}>({
// //     ${data.map(d => `${d.name}: { definition: ${d.name}, categories: [${d.categories.map(name => `'${name}'`)}] }`).join(',\n    ')}
// // })
// //
// // export { ${config.className}ID, ${config.className}Definitions }
// // `
// }

export const watch =  () => {
  gulp.watch('./client/styles/**/*.sass', { ignoreInitial: false }, buildStyles)
  gulp.watch('./client/assets/**/*', { ignoreInitial: false }, copyAssets)
  gulp.watch('./game/items/*/**/*.js', { ignoreInitial: false }, generateItemRegistry)
}

export const build = gulp.series(buildStyles, copyAssets, generateItemRegistry)

function toClassName(filename){
  let name = filename.split('.')[0]
  return name.slice(0, 1).toUpperCase() + name.slice(1)
}