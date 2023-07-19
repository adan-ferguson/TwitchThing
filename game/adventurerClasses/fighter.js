import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const FIGHTER_CLASS_INFO = {
  skills: [
    Skills.slash,
    Skills.strength,
    Skills.trailblazer,
    Skills.heavySlash,
    Skills.berserker,
    Skills.hamstring,
    Skills.shrugOff,
    Skills.recklessAttack,
    Skills.resistance,
    Skills.swiftStrikes,
    Skills.finalFight,
    Skills.execute
  ],
  items: [
    [
      Items.shortSword,
      Items.sprintingShoes,
      Items.spear,
      Items.leatherArmor,
      Items.healingPotion
    ],
    [
      Items.heavyAxe,
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