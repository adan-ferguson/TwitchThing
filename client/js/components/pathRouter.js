import AdventurerPage from './pages/adventurer/adventurerPage.js'
import MainPage from './pages/main/mainPage.js'
import LiveDungeonMapPage from './pages/liveDungeonMap/liveDungeonMapPage.js'
import ErrorPage from './pages/errorPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'
import { isObject } from '../../../game/utilFunctions.js'
import SimPage from './pages/sim/simPage.js'
import CombatPage from './pages/combat/combatPage.js'

const pages = [
  AdventurerPage,
  LiveDungeonMapPage,
  ErrorPage,
  DungeonPage,
  SimPage,
  CombatPage
]

export function pathToPage(location, queryStringArgs = {}){

  console.log('nav to', location, queryStringArgs)

  let segments = arrayTrim(location.split('/'))
  if(segments[0] === 'game'){
    segments = segments.slice(1)
  }

  let page
  pages.find(PageSubclass => {
    const args = findMatch(PageSubclass.pathDef, segments)
    if(args){
      page = new PageSubclass(...args, queryStringArgs)
      return true
    }
  })
  return page ?? new MainPage()
}

/**
 * @returns {string}
 */
export function generatePath(pathDef, pathArgs){
  let str = ''
  pathDef.forEach(def => {
    if(Number.isInteger(def) && pathArgs[def]){
      str += '/' + pathArgs[def]
    }else{
      str += '/' + def
    }
  })

  const last = pathArgs[pathArgs.length - 1]
  if(isObject(last)){
    str += '?' + new URLSearchParams(last).toString()
  }
  return str
}

function findMatch(params, segments){
  const args = []
  for(let i = 0; i < params.length; i++){
    if(Number.isInteger(params[i])){
      args[params[i]] = segments[i]
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