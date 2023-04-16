import healthIcon from '../assets/icons/health.svg'
import physPower from '../assets/icons/physPower.svg'
import magicPower from '../assets/icons/magicPower.svg'
import OrbRow, { OrbsDisplayStyle } from './components/orbRow.js'
import { makeEl, toArray } from '../../game/utilFunctions.js'
import _ from 'lodash'

const ICONS = {
  magic: magicPower,
  phys: physPower,
  health: healthIcon
}

export function parseDescriptionString(description, stats = null){

  // stats = null // TODO: think about this

  const el = document.createElement('div')
  el.classList.add('parsed-description')
  const { chunks, props } = chunk(description)
  chunks.forEach((chunk, i) => {
    if(i !== 0){
      const parsed = parseProp(props[i-1])
      if(parsed){
        el.appendChild(...toArray(parsed))
      }
    }
    el.append(chunk)
  })
  return el

  function parseProp({ type, subtype, val }){
    if(type === 'O'){
      return wrapOrbs(subtype, val, stats)
    }else if(type === 'S'){
      return wrapStat(subtype, val, stats)
    }else if(FNS[subtype]){
      return FNS[subtype](val, stats)
    }
    return null
  }
}

const scalingWrap = (damageType, amount) => {
  const valStr = _.isNumber(amount) ? Math.ceil(amount) : amount
  return makeEl({
    class: ['scaling-type', 'scaling-type-' + damageType],
    content: `${ICONS[damageType]}${valStr}`,
    elementType: 'span'
  })
}

const FNS = {
  physScaling: (val, stats) => {
    if(stats){
      val *= stats.get(physPowerStat).value
    }else{
      val = toPct(val)
    }
    return scalingWrap('phys', val)
  },
  magicScaling: (val, stats) => {
    if(stats){
      val *= stats.get(magicPowerStat).value
    }else{
      val = toPct(val)
    }
    return scalingWrap('magic', val)
  },
  physAttack: (val, stats) => {
    if(stats){
      val *= stats.get(physPowerStat).value * stats.get(attackDamageStat).value
    }else{
      val = toPct(val)
    }
    return scalingWrap('phys', val)
  },
  magicAttack: (val, stats) => {
    if(stats){
      val *= stats.get(magicPowerStat).value * stats.get(attackDamageStat).value
    }else{
      val = toPct(val)
    }
    return scalingWrap('magic', val)
  },
  physFlat: (val) => {
    return scalingWrap('phys', val)
  },
  magicFlat: (val) => {
    return scalingWrap('magic', val)
  }
}

function wrapOrbs(classType, val, stats){
  return new OrbRow()
    .setOptions({
      allowNegatives: true,
      style: OrbsDisplayStyle.MAX_ONLY,
      showTooltips: false
    })
    .setData({
      [classType]: val
    })
}

// function wrapStat(statType, val){
//   const stats = new Stats({ [statType]: val })
//   const info = getStatDisplayInfo(stats.get(statType), {
//     style: StatsDisplayStyle.ADDITIONAL
//   })
//   let content = info.displayedValue
//   if(info.icon){
//     content = `${info.icon}` + content
//   }else{
//     content += ' ' + info.text
//   }
//   return makeEl({ content, class: 'stat-wrap' })
// }

function toPct(val){
  return Math.round(val * 100) + '%'
}

function chunk(descriptionString){
  const props = []
  const chunks = descriptionString.replace(/\[([A-Z]?)([A-Za-z]*)([+-]?[\d.]+[%x]?)]/g, (_, type, subtype, val) => {
    props.push({
      type,
      subtype,
      val
    })
    return '@'
  }).split('@')
  return { props, chunks }
}