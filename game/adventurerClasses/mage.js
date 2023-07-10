import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const MAGE_CLASS_INFO = {
  skills: [
    Skills.magicMissile,
    Skills.intelligence,
    Skills.barrier,
    Skills.lightningFamiliar,
    Skills.frostRay,
    Skills.prepareSpells,
    Skills.mirrorImage,
    Skills.brilliance,
    Skills.haste,
    Skills.overload,
    Skills.fireball,
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
    Items.manaBiscuit,
  ],[
    Items.ascendedScroll,
    Items.repeatingScroll,
    Items.wizardHat,
  ]]
}