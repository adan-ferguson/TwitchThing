import { roundToFixed, toDisplayName, toPct } from '../../../game/utilFunctions.js'
import { StatType } from '../../../game/stats/statType.js'
import statValueFns from '../../../game/stats/statValueFns.js'
import { ICON_SVGS } from '../assetLoader.js'

export const StatsDisplayStyle = {
  CUMULATIVE: 0, // Eg. "50%", i.e. our total of this stat is 50%
  ADDITIONAL: 1, // Eg. "+50%", i.e. we're adding 50%
}

export const statDefinitionsInfo = {
  hpMax: {
    text: 'Max Health',
    icon: ICON_SVGS.health,
    description: 'Max Health (good description)'
  },
  physPower: {
    text: 'Phys Power',
    icon: ICON_SVGS.physPower,
    description: 'Phys power (basic attack damage)'
  },
  magicPower: {
    text: 'Magic Power',
    icon: ICON_SVGS.magicPower,
    description: 'Magic power'
  },
  physDef: {
    text: 'Phys Defense',
    icon: ICON_SVGS.physDef,
    description: 'Blocks physical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  magicDef: {
    text: 'Magic Defense',
    icon: ICON_SVGS.magicDef,
    description: 'Blocks magical damage.\nThis is multiplicative, so 50% + 50% = 75%.',
  },
  missChance: {},
  speed: {
    text: 'Speed',
    displayInverted: true,
    icon: ICON_SVGS.action,
    description: 'Speed. Each extra 100 speed is about +1 turn per 3 seconds.',
  },
  damageDealt: {},
  damageTaken: {},
  critChance: {
    text: 'Crit Chance',
    description: 'Chance to deal bonus damage.',
    displayedValueFn: flatValuePercentageDisplay
  },
  enemyCritChance: {
    text: 'Enemy Crit Chance',
    description: 'Increases enemy\'s crit chance.',
    displayedValueFn: flatValuePercentageDisplay
  },
  critDamage: {
    text: 'Crit Damage',
    description: 'Increases damage deal by crits.',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return roundToFixed(1 + value, 2) + 'x'
      }
      return `+${Math.round((value - 1) * 100)}%`
    }
  },
  dodgeChance: {
    text: 'Dodge Chance',
    description: 'Chance to dodge attacks.',
  },
  blockChance: {
    text: 'Block Chance',
    description: 'Chance to block attacks.',
  },
  lifesteal: {
    text: 'Lifesteal',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return `${Math.round(value * 100)}%`
      }
      return `+${Math.round(value * 100)}%`
    }
  },
  critLifesteal: {
    text: 'Crit Lifesteal',
    displayedValueFn: (value, { style }) => {
      if(style === StatsDisplayStyle.CUMULATIVE){
        return `${Math.round(value * 100)}%`
      }
      return `+${Math.round(value * 100)}%`
    }
  },
  combatXP: {
    text: 'XP Gain'
  },
  startingFood: {
    text: 'Starting Food',
    description: '2 + 1 per 10 levels'
  },
  cooldownMultiplier: {
    text: 'Cooldowns',
    description: 'Affects the cooldowns of your items (only items this time, I swear)'
  },
  chestLevel: {
    text: 'Increased Chest Level',
    description: 'Chests you find are higher level.'
  },
  basicAttacks: {
    text: 'Basic Attacks'
  },
  damageCeiling: {
    text: 'Damage Ceiling',
    displayedValueFn: value => toPct(value),
    description: 'Most damage they can take at once (percentage of max health)'
  }
}

const DEFAULTS = {
  description: null,
  text: null,
  icon: null
}

export function getTooltipForStatType(statType){
  return statDefinitionsInfo[statType]?.description
}

export function getStatDisplayInfo(stat, options = {}){
  options = {
    style: StatsDisplayStyle.CUMULATIVE,
    owner: null,
    ...options
  }
  if(!statDefinitionsInfo[stat.name]){
    return null
  }
  const info = { ...statDefinitionsInfo[stat.name] }
  if(info.displayedValueFn){
    info.displayedValue = info.displayedValueFn(stat.value, options)
    delete info.displayedValueFn
  }
  if(info.displayedValue === undefined){
    info.displayedValue = toText(stat, options.style)
  }
  if(info.descriptionFn){
    info.description = info.descriptionFn(stat.value, options)
    delete info.descriptionFn
  }
  return {
    ...DEFAULTS,
    text: toDisplayName(stat.name),
    ...info,
    stat,
    order: Object.keys(statDefinitionsInfo).indexOf(stat.name)
  }
}

function toText(stat, style){
  if(!stat.value && stat.type === StatType.COMPOSITE){
    return toCompositeText(stat.mods, style)
  }
  const subtractDefaultValue = style === StatsDisplayStyle.ADDITIONAL && [StatType.FLAT, StatType.COMPOSITE].includes(stat.type)
  const value = stat.value - (subtractDefaultValue ? (stat.defaultValue ?? 0) : 0)
  if(stat.type === StatType.MULTIPLIER){
    return `${value > 1 ? '+' : ''}${Math.round((value - 1) * 100)}%`
  }else if(stat.type === StatType.PERCENTAGE){
    return `${plusSign(style, value)}${roundToFixed(value * 100, 1)}%`
  }else if(stat.type === StatType.MINIMUM_ONLY){
    return value
  }
  return `${plusSign(style, value)}${value}`
}

function flatValuePercentageDisplay(value, { style }){
  let str = ''
  if(style === StatsDisplayStyle.ADDITIONAL && value > 0){
    str += '+'
  }
  return str + `${Math.round(value * 100)}%`
}

function toCompositeText(mods, style){
  if(mods.all.multi.length){
    return roundToFixed(mods.all.multi.reduce((prev, val) => prev * val, 1), 2) + 'x'
  }else if(mods.all.pct.length){
    const pctValue = statValueFns[StatType.MULTIPLIER](mods.all.pct.map(v => v + '%'))
    pctValue.type = StatType.MULTIPLIER
    return toText(pctValue, style)
  }
}

function plusSign(style, value){
  if(style !== StatsDisplayStyle.ADDITIONAL){
    return ''
  }
  if(value < 0){
    return ''
  }
  return '+'
}