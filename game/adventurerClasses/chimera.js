import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const CHIMERA_CLASS_INFO = {
  skills: [
    Skills.wildSlash,
    Skills.bite,
    Skills.bodySlam,
    Skills.unstoppable,
    Skills.furiousStrikes,
    Skills.survivalInstincts,
    Skills.predatoryInstincts,

    // Skills.fightAndOrFlight
    // Skills.enlarged hpMax, physpower, spd-

    // Skills.heavyweight, hpMax -> physPower
    // Skills.roar,
    // Skills.maul,
    // Skills.lightningTackle,
    // Skills.breatheFire,
    // Skills.trollRegeneration,
  ],
  items: [[
    Items.turtleShell,
    Items.wolfClaw,
    Items.cheetahLegs,
    // Items.waspStinger, attacks can poison
    // Items.bulk, hpMax+, spd-
  ],[
    // Items.shimmeringScales,
    // Items.krakenTentacle,   attacks slow
    // Items.batWings,         fluttering...probably can't really do that though
    // Items.salamanderSkin,   attacks deal magic damage? or fire aura?
  ],[
    // Items.phoenixPlumage,
    // Items.extraArms, ^v
    // Items.behemothCarapace, damage threshold
  ]]
}