import Items from './items/combined.js'
import Skills from './skills/combined.js'

const fighter = {
  skills: [
    Skills.slash,
    Skills.strength,
    Skills.trailblazer,
    Skills.heavySlash,
    Skills.berserker,
    Skills.hamstring,
    Skills.shrugOff,
    Skills.swiftStrikes,
    Skills.resistance,
    Skills.recklessAttack,
    Skills.tetheredManeuver,
    Skills.execute,
  ],
  items: [
    [
      Items.shortSword,
      Items.sprintingShoes,
      Items.heavyAxe,
      Items.leatherArmor,
      Items.healingPotion
    ],
    [
      Items.spear,
      Items.serratedBlade,
      Items.coffeeCarafe,
      Items.heavyArmor,
    ],
    [
      Items.gigaHammer,
      Items.twinBlades,
      Items.swordOfFables
    ]
  ]
}

const mage = {
  skills: [
    Skills.magicMissile,
    Skills.barrier,
    Skills.intelligence,
    Skills.frostRay,
    Skills.mirrorImage,
    Skills.haste,
    Skills.brilliance,
    Skills.fireball,
    Skills.imbueWeapons,
    Skills.overload,
    Skills.higherLearning,
    Skills.lightningStorm,
  ],
  items: [[
    Items.wand,
    Items.robes,
    Items.powerScroll,
    Items.spellbook,
    Items.magicRing,
  ],[
    Items.favoriteScroll,
    Items.unstableScroll,
    Items.miniatureScroll,
    Items.manaSeasoning,
  ],[
    Items.ascendedScroll,
    Items.repeatingScroll,
    Items.wizardHat,
  ]]
}

const paladin = {
  skills: [],
  items: [[],[],[]]
}

const rogue = {
  skills: [],
  items: [[],[],[]]
}

const chimera = {
  skills: [],
  items: [[],[],[]]
}

const INFO = {
  fighter,
  mage,
  paladin,
  rogue,
  chimera
}

for(let advClass in INFO){
  INFO[advClass].skills.forEach((s, i) => s.index = i)
  INFO[advClass].items.forEach((rarity, i) => {
    rarity.forEach(item => item.rarity = i)
  })
}

export function getClassInfo(className){
  return INFO[className]
}

export function getAllItemsByClass(){
  const items = {}
  for(let className in INFO){
    items[className] = INFO[className].items.flat()
  }
  return items
}

export function getAllItemKeys(){
  const keys = []
  for(let className in INFO){
    INFO[className].items.forEach(arr => {
      arr.forEach(item => {
        keys.push(item.baseItemId)
      })
    })
  }
  return keys
}