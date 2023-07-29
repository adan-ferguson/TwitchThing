import { fillArray } from './utilFunctions.js'

export default class SlotModifierCollection{

  constructor(objs, propName){

    this.objs = objs
    this.propName = propName
    this._outgoingModifiers = fillArray(() => fillArray(() => null, 8), 2)

    const matrices = []
    for(let i = 0; i < 8; i++){
      matrices.push(this.outgoingModifiers(0, i))
      matrices.push(this.outgoingModifiers(1, i))
    }

    this._modifiers = mergeMatrices(matrices.filter(m => m))
  }

  get(col, row, prop, loadoutObject = null){
    return isolate(this._modifiers[col][row] ?? [], prop, loadoutObject)
  }

  outgoingModifiers(col, row){
    if(this._outgoingModifiers[col][row] === null){
      this._outgoingModifiers[col][row] = calcOutgoing(this.objs[col][row], col, row, this.propName)
    }
    return this._outgoingModifiers[col][row]
  }
}

function calcOutgoing(obj, col, row, propName){
  const mtx = fillArray(() => fillArray(() => {
    return []
  }, 8), 2)
  if(!obj?.[propName]){
    return false
  }
  for(let modifier of obj[propName]){
    getSubjects(modifier.subjectKey, col, row).forEach(subj => {
      mtx[subj.col][subj.row].push(modifier)
    })
  }
  return mtx
}

export function getSubjects(subjectKey, col, row){
  const subjects = []
  if(subjectKey === 'self'){
    subjects.push({ col, row })
  }else if(subjectKey === 'attached'){
    subjects.push({ col: (col + 1) % 2, row })
  }else if(subjectKey === 'neighbouring'){
    if(row > 0){
      subjects.push({ col, row: row - 1 })
    }
    if(row < 7){
      subjects.push({ col, row: row + 1 })
    }
  }else if(subjectKey === 'allItems'){
    for(let i = 0; i < 8; i++){
      subjects.push({ col: 0, row: i })
    }
  }else if(subjectKey === 'all'){
    for(let i = 0; i < 8; i++){
      subjects.push({ col: 0, row: i })
      subjects.push({ col: 1, row: i })
    }
  }
  return subjects
}

function mergeMatrices(mtcs){
  const merged = fillArray(() => fillArray(() => {
    return []
  }, 8), 2)
  mtcs.forEach(add)
  return merged
  function add(toAdd){
    for(let i in toAdd){
      for(let j in toAdd[i]){
        merged[i][j].push(...toAdd[i][j])
      }
    }
  }
}
function isolate(arrayOfObjs, propName, loadoutObject){
  const arr = []
  arrayOfObjs.forEach(obj => {
    if(obj[propName]){
      if(conditionsMatch(obj.conditions, loadoutObject)){
        arr.push(obj[propName])
      }
    }
  })
  return arr
}

function conditionsMatch(conditions, loadoutObject){
  if(!conditions || !loadoutObject){
    return true
  }
  if(conditions.hasTag && !loadoutObject.tags?.includes(conditions.hasTag)){
    return false
  }
  if(conditions.hasAbility && !loadoutObject.abilities.find(a => a.trigger === conditions.hasAbility)){
    return false
  }
  return true
}