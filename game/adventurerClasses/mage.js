import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const MAGE_CLASS_INFO = {
  skills: [
    Skills.magicMissile,
    Skills.barrier,
    Skills.intelligence,
    Skills.frostRay,
    Skills.lightningStorm,
    Skills.mirrorImage,
    // Skills.imbueWeapons,
    Skills.haste,
    Skills.overload,
    Skills.fireball,
    Skills.brilliance,
    Skills.higherLearning,
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