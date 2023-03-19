export function orbPointIcon(){
  return coloredIcon('circle', '#f3d472')
}

export function skillPointIcon(){
  return coloredIcon('star', '#92eac6', 'skill-point')
}

export function skillPointEntry(count){
  return `<span class="skil-point-entry">${count}${skillPointIcon()}</span>`
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