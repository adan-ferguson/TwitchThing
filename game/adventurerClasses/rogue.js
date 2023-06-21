import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const ROGUE_CLASS_INFO = {
  skills: [
    Skills.quickAttack,
    Skills.evasion,
    Skills.ambush,
    Skills.sneakPast,
    Skills.anOpening,
  ],
  items: [[
    Items.dagger,
    Items.pocketSand,
    Items.bootsOfSwiftness,
    Items.bagOfGold,
    Items.treasureMap,
  ],[
    Items.cripplingPoison,
    Items.sleepPowder,
    // Items.cloak
  ],[
    Items.luckyRing
  ]]
}