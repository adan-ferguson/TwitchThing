import Items from './items/combined.js'
import Skills from './skills/combined.js'

const fighter = {
  skills: [
    Skills.slash
  ],
  items: [
    [
      Items.shortSword
    ],
    [],
    []
  ]
}

const mage = {
  skills: [],
  items: [[],[],[]]
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
  INFO[advClass].items.forEach((tier, i) => {
    tier.forEach(item => item.tier = i)
  })
}

export function getClassInfo(className){
  return INFO[className]
}