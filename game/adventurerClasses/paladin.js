import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const PALADIN_CLASS_INFO = {
  skills: [
    Skills.smite,
    Skills.shieldBash,
    Skills.ardent,
    Skills.lesserHeal,
    Skills.devotion,
    Skills.balancedSmite,
    Skills.shieldsUp,
    Skills.patience,
    Skills.greaterHeal,
    Skills.penance,
    Skills.purity,
    Skills.divineIntervention
  ],
  items: [[
    Items.buckler,
    Items.towerShield,
    Items.mace,
    Items.chainMail,
    Items.holyBlade
  ],[
    Items.spikedShield,
    Items.magicMail,
    Items.cleansingPotion,
    Items.inquisitorsMace
  ],[
    Items.immaculateShield,
    Items.angelicMail,
    Items.celestialGreatsword
  ]]
}