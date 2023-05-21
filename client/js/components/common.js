import Stats from '../../../game/stats/stats.js'
import { getStatDisplayInfo, StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { makeEl, roundToNearestIntervalOf } from '../../../game/utilFunctions.js'
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

export function orbPointEntry(count){
  return `<span class="orb-point-entry icon-and-value">${count}${orbPointIcon()}</span>`
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

export function neighbouring(){
  return '<i class="fa-solid fa-arrows-up-down attached-skill"></i>'
}

export function wrapStat(statType, val){
  const stats = new Stats({ [statType]: val })
  const info = getStatDisplayInfo(stats.get(statType), {
    style: StatsDisplayStyle.ADDITIONAL
  })
  let content = info.displayedValue
  if(info.icon){
    return `<span class="stat-wrap icon-and-value" stat-type="${statType}">${content}${info.icon}</span>`
  }else{
    return `<span class="stat-wrap icon-and-value" stat-type="${statType}">${content} ${info.text}</span>`
  }
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

export function toSeconds(ms){
  return roundToNearestIntervalOf(ms / 1000, 0.01) + 's'
}

export function statScaling(scaling, abilityInstance, range = null){
  const chunks = []
  for(let scalingType in scaling){
    if(['physPower', 'magicPower'].includes(scalingType)){
      const val = scaling[scalingType]
      let str = ''
      if(abilityInstance){
        const statVal = val * abilityInstance.totalStats.get(scalingType).value
        if(range){
          const val1 = Math.ceil(statVal * range[0])
          const val2 = Math.ceil(statVal * range[1])
          str = val1 + ' to ' + val2
        }else{
          str = Math.ceil(statVal)
        }
      }else{
        if(range){
          const val1 = Math.ceil(range[0] * val * 100)
          const val2 = Math.ceil(range[1] * val * 100)
          str = `${val1}% to ${val2}%`
        }else{
          str = `${val * 100}%`
        }
      }
      chunks.push(scalingWrap(scalingType, str))
    }
  }
  return chunks.join(' + ')
}

export function affectsIcon(affects){
  if(affects === 'attached'){
    return attachedItem()
  }else if(affects === 'neighbouring'){
    return neighbouring()
  }
  return ''
}