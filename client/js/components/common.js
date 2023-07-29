import Stats from '../../../game/stats/stats.js'
import { getStatDisplayInfo, statDefinitionsInfo, StatsDisplayStyle } from '../displayInfo/statsDisplayInfo.js'
import {
  deepClone,
  makeEl,
  roundToNearestIntervalOf,
  toDisplayName,
  toPct,
  wrapContent
} from '../../../game/utilFunctions.js'
import health from '../../assets/icons/health.svg'
import physPower from '../../assets/icons/physPower.svg'
import magicPower from '../../assets/icons/magicPower.svg'
import speed from '../../assets/icons/action.svg'
import gold from '../../assets/icons/gold.svg'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import AbilityInstance from '../../../game/abilityInstance.js'
import { subjectKeyForLoadoutObject } from '../subjectClientFns.js'
import { scaledNumberFromInstance } from '../../../game/scaledNumber.js'
import tippy from 'tippy.js'

export function physPowerIcon(){
  return physPower
}

export function magicPowerIcon(){
  return magicPower
}

export function healthIcon(){
  return health
}

export function orbPointIcon(){
  return coloredIcon('circle', '#f3d472')
}

export function skillPointIcon(){
  return coloredIcon('star', '#92eac6', 'skill-point')
}

export function scrapEntry(txt = null){
  return `<span class="icon-and-value">${txt}${faIcon('recycle')}</span>`
}

export function orbPointEntry(count){
  return `<span class="orb-point-entry icon-and-value">${count}${orbPointIcon()}</span>`
}

export function xpIcon(){
  return `
<span class="xp-icon">
  <i class="fa-solid fa-x"></i>
  <i class="fa-solid fa-p"></i>
  <i class="fa-solid fa-plus"></i>
</span>`
}

export function skillPointEntry(count){
  return `<span class="skill-point-entry icon-and-value">${count}${skillPointIcon()}</span>`
}

export function goldEntry(count){
  return iconAndValue(gold, count)
}

export function iconAndValue(iconSvg, value){
  return `<span class="icon-and-value">${value}${iconSvg}</span>`
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
  return `<i ${text ? '' : 'tooltip="Attached Item"'} class="fa-solid fa-arrow-left attached-item"></i>${text ? ' <b>Attached Item</b>' : ''}`
}

export function attachedActiveSkill(){
  return activeAbility(faIcon('arrow-right'))
}

export function attachedSkill(text = false){
  return `<i class="fa-solid fa-arrow-right attached-skill"></i>${text ? ' <b>Attached Skill</b>' : ''}`
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

export function wrapStats(stats, { exclude = [] } = {}){
  const chunks = []
  const allStats = Object.values(new Stats(stats).getAll())
  for(let stat of allStats){
    if(!exclude.includes(stat.name)){
      chunks.push(wrapStatObj(stat))
    }
  }
  return chunks.join(' and ')
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
    return `<span class="stat-wrap icon-and-value" tooltip="${info.text}" stat-type="${statObj.type}">${content}${info.icon}</span>`
  }else{
    return `<span class="stat-wrap" tooltip="${info.text}" stat-type="${statObj.type}">${content} ${info.text}</span>`
  }
}

export function describeStat(statType){
  const info = statDefinitionsInfo[statType]
  if(info.icon){
    return `<span class="stat-wrap icon-and-value" stat-type="${statType}">${info.text}${info.icon}</span>`
  }else{
    return `<span class="stat-wrap" stat-type="${statType}">${info.text}</span>`
  }
}

export function scalingWrap(scalingType, valStr = '', showExtra = true){
  const ICONS = {
    magicPower: magicPower,
    physPower: physPower,
    health: health,
    hpMax: health,
    speed: speed,
  }
  let extra = ''
  if(showExtra){
    if(scalingType === 'health'){
      extra = ' current health'
    }else if (scalingType === 'hpMax'){
      extra = ' max health'
    }
  }
  return `
<span class="icon-and-value" scaling-type="${scalingType}" tooltip="${toDisplayName(scalingType)}">
    ${valStr}${extra}${ICONS[scalingType]}
</span>`
}

export function toSeconds(ms){
  return roundToNearestIntervalOf(ms / 1000, 0.01) + 's'
}

export function statScaling(scaling, obj = null, range = null, sourceStr = ''){
  const chunks = []
  for(let scalingType in scaling){
    const val = scaling[scalingType]
    if(['physPower', 'magicPower', 'hpMax'].includes(scalingType)){
      let str = ''
      if(obj?.totalStats){
        const statVal = val * obj.totalStats.get(scalingType).value
        if(range){
          const val1 = Math.ceil(statVal * range[0])
          const val2 = Math.ceil(statVal * range[1])
          str = val1 + ' to ' + val2
        }else{
          str = Math.ceil(statVal)
        }
      }else{
        if(range){
          const val1 = range[0] * val
          const val2 = range[1] * val
          str = `${toPct(val1)} to ${toPct(val2)}`
        }else{
          str = toPct(val)
        }
      }
      chunks.push(scalingWrap(scalingType, str + sourceStr, obj?.totalStats ? false : true))
    }else if(scalingType === 'hp'){
      chunks.push(scalingWrap('health', toPct(val) + sourceStr))
    }
  }
  return chunks.join(' + ')
}

export function affectsIcon(obj){
  const isItem = obj instanceof AdventurerItem
  const subjectKey = subjectKeyForLoadoutObject(obj)
  if(subjectKey === 'attached'){
    return isItem ? attachedSkill() : attachedItem()
  }else if(subjectKey === 'neighbouring'){
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
  target.prepend(cover)
}

export function activeAbility(txt = 'Active'){
  return `<span class="active-ability-rect" tooltip="Active Ability">${txt}</span>`
}

export function triggeredAbility(txt){
  return `<span class="triggered-ability-rect" tooltip="Triggered Ability">${txt}</span>`
}

export function pluralize(str, count){
  return `${count} ${str + (count === 1 ? '' : 's')}`
}

export function addTooltipToSvg(svg, tooltip){
  const el = wrapContent(svg, { tooltip })
  return el.innerHTML
}

export function optionalScaledNumber(osn, instance){
  if(!osn.scaledNumber){
    return osn
  }
  if(instance){
    return scaledNumberFromInstance(instance, osn.scaledNumber)
  }
  return 'TODO: scaling wrap?'
}

export function capitalizeFirstChunk(chunks){
  if(!chunks.length){
    return chunks
  }
  chunks = deepClone(chunks)
  chunks[0] = capitalize(chunks[0])
  return chunks
}

export function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function simpleTippy(el, content){
  tippy(el, {
    theme: 'light',
    content
  })
}