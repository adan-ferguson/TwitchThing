export function orbPointIcon(){
  return coloredIcon('circle', '#f3d472')
}

export function skillPointIcon(){
  return coloredIcon('star', '#92eac6', 'skill-point')
}

export function coloredIcon(iconName, color, cls = null){
  return `<i style="color:${color};" class="fa-solid fa-${iconName} ${cls}"></i>`
}