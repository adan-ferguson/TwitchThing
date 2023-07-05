import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const CHIMERA_CLASS_INFO = {
  skills: [
    Skills.wildSlash,
    Skills.bite,
    Skills.survivalInstincts,
    Skills.enlarged,
    Skills.bodySlam,
    Skills.fightAndOrFlight,
    Skills.senseWeakness,
    Skills.furiousStrikes,
    Skills.unstoppable,
    Skills.extraArms,
    Skills.elementalBreath,
    // Skills.???,
  ],
  items: [[
    Items.turtleShell,
    Items.wolfClaw,
    Items.cheetahLegs,
    Items.waspStinger,
    Items.layerOfBulk, // name....
  ],[
    Items.shimmeringScales,
    // Items.batWings,         fluttering...probably can't really do that though
    Items.salamanderTail,
    Items.regeneration,
  ],[
    // Items.phoenixPlumage,
    // Items.krakenTentacle,   attacks slow
    // Items.behemothCarapace, damage threshold
  ]]
}