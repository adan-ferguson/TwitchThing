import AdventurerPage from './pages/adventurer/adventurerPage.js'
import MainPage from './pages/main/mainPage.js'
import Page from './pages/page.js'

const pages = [
  AdventurerPage
]

export default function getStartPage(){
  const segments = arrayTrim(window.location.pathname.split('/'))
  const page = pages.find(PageSubclass => {
    const args = findMatch(PageSubclass.pathDef, segments)
    if(args){
      debugger
      return new PageSubclass(...args)
    }
  })
  return page ?? new MainPage()
}

function findMatch(params, segments){
  const args = []
  for(let i = 0; i < params.length; i++){
    if(params[i] === 'ARG'){
      args.push(segments[i])
    }else if(segments[i] !== params[i]){
      return false
    }
  }
  return args
}

function arrayTrim(arr){
  const vals = []
  arr.forEach(item => {
    if(item){
      vals.push(item)
    }
  })
  return vals
}