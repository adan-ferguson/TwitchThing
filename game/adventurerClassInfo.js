import Items from './items/combined.js'
import Skills from './skills/combined.js'

const INFO = {
  fighter: {
    skills: [
      Skills.fighter00,
      Skills.fighter01,
      Skills.fighter02,
      Skills.fighter03,
      Skills.fighter04,
      Skills.fighter05,
      Skills.fighter06,
      Skills.fighter07,
      Skills.fighter08,
      Skills.fighter09,
      Skills.fighter10,
      Skills.fighter11,
    ],
    items: [
      [
        Items.fighter00,
        Items.fighter01,
        Items.fighter02,
        Items.fighter03,
        Items.fighter04,
      ],
      [
        Items.fighter05,
        Items.fighter06,
        Items.fighter07,
        Items.fighter08,
      ],
      [
        Items.fighter09,
        Items.fighter10,
        Items.fighter11,
      ]
    ]
  }
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