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
    // Skills.regeneration,
    // Skills.onTheBackfoot,
    Skills.unstoppable,
    // Skills.elementalBreath,
  ],
  items: [[
    Items.turtleShell,
    Items.wolfClaw,
    Items.cheetahLegs,
    Items.waspStinger,
    Items.layerOfBulk, // name....
  ],[
    // Items.shimmeringScales,
    // Items.krakenTentacle,   attacks slow
    // Items.batWings,         fluttering...probably can't really do that though
    // Items.salamanderTail,   attacks deal magic damage?
  ],[
    // Items.phoenixPlumage,
    // Items.extraArms, ^v
    // Items.behemothCarapace, damage threshold
  ]]
}