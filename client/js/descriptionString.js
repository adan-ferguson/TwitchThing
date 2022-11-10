import healthIcon from '../assets/icons/health.svg'
import physPower from '../assets/icons/physPower.svg'
import magicPower from '../assets/icons/magicPower.svg'
import { getStatDisplayInfo } from './statsDisplayInfo.js'
import OrbRow, { OrbsDisplayStyle } from './components/orbRow.js'
import Stats from '../../game/stats/stats.js'
import { makeEl } from '../../game/utilFunctions.js'
import { attackDamageStat, magicPowerStat, physPowerStat } from '../../game/stats/combined.js'

const ICONS = {
  magic: magicPower,
  phys: physPower,
  health: healthIcon
}

export function parseDescriptionString(description, stats = null){
  const props = []
  const chunks = description.replace(/\[([A-Z]?)([A-Za-z]*)([\d.-]+)]/g, (_, type, subtype, val) => {
    props.push({
      type,
      subtype,
      val
    })
    return '@'
  }).split('@')

  const el = document.createElement('div')
  chunks.forEach((chunk, i) => {
    if(i !== 0){
      const { type, subtype, val } = props[i-1]
      if(type === 'O'){
        el.appendChild(wrapOrbs(subtype, val, stats))
      }else if(type === 'S'){
        el.appendChild(wrapStat(subtype, val, stats))
      }else if(FNS[subtype]){
        el.appendChild(FNS[subtype](val, stats))
      }
    }
    el.appendChild(makeEl({ text: chunk }))
  })
  return el
}

const scalingWrap = (damageType, amount) => `
<span class="scaling-type scaling-type-${damageType}">
  <img src="${ICONS[damageType]}">
  ${Math.ceil(amount)}
</span>
`

const FNS = {
  physScaling: (val, stats) => {
    if(stats){
      val *= stats.get(physPowerStat).value
    }else{
      val = toPct(val)
    }
    return makeEl({ content: scalingWrap('phys', val) })
  },
  magicScaling: (val, stats) => {
    if(stats){
      val *= stats.get(magicPowerStat).value
    }else{
      val = toPct(val)
    }
    return makeEl({ content: scalingWrap('magic', val) })
  },
  physAttack: (val, stats) => {
    if(stats){
      val *= stats.get(physPowerStat).value * stats.get(attackDamageStat).value
    }else{
      val = toPct(val)
    }
    return makeEl({ content: scalingWrap('phys', val) })
  },
  magicAttack: (val, stats) => {
    if(stats){
      val *= stats.get(magicPowerStat).value * stats.get(attackDamageStat).value
    }else{
      val = toPct(val)
    }
    return makeEl({ content: scalingWrap('magic', val) })
  },
}

function wrapOrbs(classType, val, stats){
  return new OrbRow()
    .setOptions({ allowNegatives: true, style: OrbsDisplayStyle.MAX_ONLY })
    .setData({
      [classType]: val
    })
}

function wrapStat(statType, val){
  const stats = new Stats({ [statType]: val })
  const info = getStatDisplayInfo(stats.get(statType))
  if(info.icon){
    return makeEl({ content: `<img src="${info.icon}">${val}`, class: 'stat-wrap' })
  }else{
    return makeEl({ content: val, class: 'stat-wrap' })
  }
}

function toPct(val){
  return val * 100 + '%'
}