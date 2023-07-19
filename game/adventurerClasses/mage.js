import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

Skills.prepareSpells = Skills.glitchedCooldowns

export const MAGE_CLASS_INFO = {
  skills: [
    Skills.magicMissile,
    Skills.intelligence,
    Skills.barrier,
    Skills.magicAttack,
    Skills.frostRay,
    Skills.brilliance,
    Skills.mirrorImage,
    Skills.overload,
    Skills.haste,
    Skills.glitchedCooldowns,
    Skills.fireball,
    Skills.higherLearning,
  ],
  items: [[
    Items.robes,
    Items.powerScroll,
    Items.spellbook,
    Items.magicRing,
    Items.manaBiscuit,
  ],[
    Items.favoriteScroll,
    Items.unstableScroll,
    Items.miniatureScroll,
    Items.lightningRing,
  ],[
    Items.ascendedScroll,
    Items.repeatingScroll,
    Items.wizardHat,
  ]]
}