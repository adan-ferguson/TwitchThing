import Stats from '../../../game/stats/stats.js'
import { getStatDisplayInfo, StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import { makeEl, roundToNearestIntervalOf } from '../../../game/utilFunctions.js'
import healthIcon from '../../assets/icons/health.svg'
import physPower from '../../assets/icons/physPower.svg'
import magicPower from '../../assets/icons/magicPower.svg'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import AbilityInstance from '../../../game/abilityInstance.js'

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

export function refundTime(str){
  return `<span class="icon-and-value" tooltip="Next turn time">${str}${faIcon('clock-rotate-left')}</span>`
}

export function orbEntries(obj){
  return Object.keys(obj).map(key => orbEntry(key, obj[key]))
}

export function orbEntry(cls, count){
  return `<di-orb-entry orb-class="${cls}" orb-used="${count}"></di-orb-entry>`
}

export function faIcon(iconName){
  return coloredIcon(iconName)
}

export function coloredIcon(iconName, color = null, cls = null){
  const s = color ? `style="color:${color};"` : ''
  return `<i ${s} class="fa-solid fa-${iconName} ${cls ?? ''}"></i>`
}

export function attachedItem(text = false){
  return `<i class="fa-solid fa-arrow-left attached-item"></i>${text ? ' <b>Attached Skill</b>' : ''}`
}

export function attachedSkill(text = false){
  return `<i class="fa-solid fa-arrow-right attached-skill"></i>${text ? ' <b>Attached Item</b>' : ''}`
}

export function neighbouringIcon(){
  return '<i class="fa-solid fa-arrows-up-down attached-skill"></i>'
}

export function aboveIcon(){
  return '<i class="fa-solid fa-arrow-up attached-skill"></i>'
}

export function belowIcon(){
  return '<i class="fa-solid fa-arrow-down attached-skill"></i>'
}

export function wrapStats(stats){
  const chunks = []
  const allStats = Object.values(stats.getAll())
  for(let stat of allStats){
    chunks.push(wrapStatObj(stat))
  }
  return chunks.join(', ')
}

export function wrapStat(statType, val){
  return wrapStatObj(new Stats({ [statType]: val }).get(statType))
}

export function wrapStatObj(statObj){
  const info = getStatDisplayInfo(statObj, {
    style: StatsDisplayStyle.ADDITIONAL
  })
  let content = info.displayedValue
  if(info.icon){
    return `<span class="stat-wrap icon-and-value" stat-type="${statObj.type}">${content}${info.icon}</span>`
  }else{
    return `<span class="stat-wrap icon-and-value" stat-type="${statObj.type}">${content} ${info.text}</span>`
  }
}

export function scalingWrap(scalingType, valStr = ''){
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

export function statScaling(scaling, abilityInstance = null, range = null){
  const chunks = []
  for(let scalingType in scaling){
    if(['physPower', 'magicPower'].includes(scalingType)){
      const val = scaling[scalingType]
      let str = ''
      if(abilityInstance instanceof AbilityInstance){
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
          str = `${Math.ceil(val * 100)}%`
        }
      }
      chunks.push(scalingWrap(scalingType, str))
    }
  }
  return chunks.join(' + ')
}

export function affectsIcon(affects, isItem = false){
  if(affects === 'attached'){
    return isItem ? attachedSkill() : attachedItem()
  }else if(affects === 'neighbouring'){
    return neighbouringIcon()
  }
  return ''
}

export function isAdventurerItem(obj){
  return obj instanceof AdventurerItem || obj?.obj instanceof AdventurerItem
}

export function featureLocked(target, msg){
  if(target.querySelector('.feature-locked')){
    return
  }
  const cover = makeEl({ class: 'feature-locked', content: `${faIcon('lock')} <span>${msg}</span>` })
  target.appendChild(cover)
}

export function activeAbility(){
  return '<span class="active-ability-rect">Active</span>'
}

export function triggeredAbility(){
  return '<span class="triggered-ability-rect">Trigger</span>'
}