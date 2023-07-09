import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const ROGUE_CLASS_INFO = {
  skills: [
    Skills.quickAttack,
    Skills.evasion,
    Skills.appraise,
    Skills.sneakPast,
    Skills.anOpening,
    Skills.lethalStrike,
    Skills.burstOfSpeed,
    Skills.exhaustiveSearch,
    Skills.flawlessness,
    Skills.deadlyMagickqs,
    Skills.midasTouch,
    Skills.criticalCrit,
  ],
  items: [[
    Items.dagger,
    Items.pocketSand,
    Items.cloak,
    Items.bagOfGold,
    Items.treasureMap,
  ],[
    Items.cripplingPoison,
    Items.sleepPowder,
    Items.deadlyBlade,
    Items.phantomCloak,
  ],[
    Items.luckyRing,
    Items.theBountyCollector,
    Items.secretWeapon,
  ]]
}