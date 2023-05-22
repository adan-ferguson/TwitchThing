import { attachedItem, attachedSkill, neighbouring } from './components/common.js'


export function subjectDescription(subjectKey, isItem){
  if(subjectKey === 'self'){
    return 'This '
  }else if(subjectKey === 'allItems'){
    return 'Each equipped item '
  }else if(subjectKey === 'attached'){
    const icon = isItem ? attachedSkill() : attachedItem()
    return `${icon} Attached ${isItem ? 'skill' : 'item'} `
  }else if(subjectKey === 'neighbouring'){
    return`${neighbouring()} Neighbouring ${isItem ? 'Items' : 'Skills'} `
  }
  return ''
}