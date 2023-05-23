import { attachedItem, attachedSkill, neighbouringIcon } from './components/common.js'


export function subjectDescription(subjectKey, isItem){
  if(subjectKey === 'self'){
    return 'This '
  }else if(subjectKey === 'allItems'){
    return 'Each equipped item '
  }else if(subjectKey === 'attached'){
    return isItem ? attachedSkill(true) : attachedItem(true)
  }else if(subjectKey === 'neighbouring'){
    return`${neighbouringIcon()} Neighbouring ${isItem ? 'Items' : 'Skills'} `
  }
  return ''
}