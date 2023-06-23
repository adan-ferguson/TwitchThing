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