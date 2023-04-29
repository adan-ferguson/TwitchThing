import Stats from '../../../game/stats/stats.js'
import { getStatDisplayInfo, StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { makeEl } from '../../../game/utilFunctions.js'
import healthIcon from '../../assets/icons/health.svg'
import physPower from '../../assets/icons/physPower.svg'
import magicPower from '../../assets/icons/magicPower.svg'
import _ from 'lodash'

export function orbPointIcon(){
  return coloredIcon('circle', '#f3d472')
}

export function skillPointIcon(){
  return coloredIcon('star', '#92eac6', 'skill-point')
}

export function skillPointEntry(count){
  return `<span class="skill-point-entry icon-and-value">${count}${skillPointIcon()}</span>`
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

export function wrapStat(statType, val){
  const stats = new Stats({ [statType]: val })
  const info = getStatDisplayInfo(stats.get(statType), {
    style: StatsDisplayStyle.ADDITIONAL
  })
  let content = info.displayedValue
  if(info.icon){
    content = `${info.icon}` + content
  }else{
    content += ' ' + info.text
  }
  return makeEl({ content, class: 'stat-wrap' })
}

export function scalingWrap(scalingType, valStr){
  const ICONS = {
    magicPower: magicPower,
    physPower: physPower,
    health: healthIcon
  }
  return `
<span class="icon-and-value" scaling-type="${scalingType}">
    ${valStr}${ICONS[scalingType]}
</span>`
}