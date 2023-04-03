export function orbPointIcon(){
  return coloredIcon('circle', '#f3d472')
}

export function skillPointIcon(){
  return coloredIcon('star', '#92eac6', 'skill-point')
}

export function skillPointEntry(count){
  return `<span class="skill-point-entry">${count}${skillPointIcon()}</span>`
}

export function orbEntries(obj){
  return Object.keys(obj).map(key => orbEntry(key, obj[key]))
}

export function orbEntry(cls, count){
  return `<di-orb-entry orb-class="${cls}" orb-used="${count}"></di-orb-entry>`
}

export function coloredIcon(iconName, color, cls = null){
  return `<i style="color:${color};" class="fa-solid fa-${iconName} ${cls}"></i>`
}

export function attachedItem(){
  return '<i class="fa-solid fa-arrow-left attached-item"></i>'
}

export function attachedSkill(){
  return '<i class="fa-solid fa-arrow-right attached-skill"></i>'
}