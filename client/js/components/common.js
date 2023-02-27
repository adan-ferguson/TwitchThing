export function orbPointIcon(){
  return coloredIcon('circle', '#f3d472')
}

export function skillPointIcon(){
  return coloredIcon('star', '#92eac6')
}

export function coloredIcon(iconName, color){
  return `<i style="color:${color};" class="fa-solid fa-${iconName}"></i>`
}