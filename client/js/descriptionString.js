import healthIcon from '../assets/icons/health.svg'
import physPower from '../assets/icons/physPower.svg'
import magicPower from '../assets/icons/magicPower.svg'
import { getStatDisplayInfo } from './statsDisplayInfo.js'
import OrbRow, { OrbsDisplayStyle } from './components/orbRow.js'
import Stats from '../../game/stats/stats.js'
import { makeEl, toArray } from '../../game/utilFunctions.js'
import { attackDamageStat, magicPowerStat, physPowerStat } from '../../game/stats/combined.js'
import _ from 'lodash'

const ICONS = {
  magic: magicPower,
  phys: physPower,
  health: healthIcon
}

export function parseDescriptionString(description, stats = null){

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
    content: `<img src="${ICONS[damageType]}">${valStr}`,
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

function chunk(descriptionString){
  const props = []
  const chunks = descriptionString.replace(/\[([A-Z]?)([A-Za-z]*)([\d.-]+)]/g, (_, type, subtype, val) => {
    props.push({
      type,
      subtype,
      val
    })
    return '@'
  }).split('@')
  return { props, chunks }
}