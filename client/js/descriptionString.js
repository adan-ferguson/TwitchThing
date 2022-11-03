import healthIcon from '../assets/icons/health.svg'
import physPower from '../assets/icons/physPower.svg'
import magicPower from '../assets/icons/magicPower.svg'
import { getStatDisplayInfo } from './statsDisplayInfo.js'
import OrbRow, { OrbsDisplayStyle } from './components/orbRow.js'
import Stats from '../../game/stats/stats.js'
import { makeEl, wrapContent } from '../../game/utilFunctions.js'

const ICONS = {
  magic: magicPower,
  phys: physPower,
  health: healthIcon
}

export function parseDescriptionString(description, owner = null){
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
        el.appendChild(wrapOrbs(subtype, val, owner))
      }else if(type === 'S'){
        el.appendChild(wrapStat(subtype, val, owner))
      }else if(FNS[subtype]){
        el.appendChild(FNS[subtype](val, owner))
      }
    }
    el.appendChild(wrapContent(chunk))
  })
  return el
}

const scalingWrap = (damageType, amount) => `
<span class="scaling-type scaling-type-${damageType}">
  <img src="${ICONS[damageType]}">
  ${amount}
</span>
`

const FNS = {
  physScaling: (val, owner) => {
    return scalingWrap('phys', val)
  },
  magicScaling: (val, owner) => {
    return scalingWrap('magic', val)
  },
}

function wrapOrbs(classType, val, owner){
  return new OrbRow()
    .setOptions({ allowNegatives: true, style: OrbsDisplayStyle.MAX_ONLY })
    .setData({
      [classType]: val
    })
}

function wrapStat(statType, val, owner){
  const stats = new Stats({ [statType]: val })
  const info = getStatDisplayInfo(stats.get(statType))
  if(info.icon){
    return makeEl({ content: `<img src="${info.icon}">${val}`, class: 'stat-wrap' })
  }else{
    return makeEl({ content: val, class: 'stat-wrap' })
  }
}