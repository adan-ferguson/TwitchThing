import Skills from '../skills/combined.js'
import Items from '../items/combined.js'

export const CHIMERA_CLASS_INFO = {
  skills: [
    // Skills.wildSlash,
    // Skills.bite,
    Skills.unstoppable,
    // Skills.bodySlam,
    // Skills.maul,
    // Skills.survivalInstincts,
    // Skills.enlarged,
    // Skills.predatoryInstincts,
    // Skills.lightningTackle,
    // Skills.breatheFire,
    // Skills.roar,
    // Skills.extraArms,
    // Skills.furiousStrikes, like swift strikes but scales with speed
    // Skills.trollRegeneration,
    // Skills.fightAndOrFlight
  ],
  items: [[
    Items.turtleShell,  // this is
    Items.wolfClaw,
    // Items.waspStinger, attacks can poison
    // Items.spiderWebbing, // meh
    // Items.gatorHide, // no
    // Items.cheetahLegs, spd+
  ],[
    // Items.mammothStrength, hp+, ppow+, spd-
    // Items.batWings,        fluttering...probably can't really do that though
    // Items.goldenMane,
  ],[
    // Items.phoenixPlumage,
    // Items.krakenTentacle,   attacks slow
    // Items.behemothCarapace,
  ]]
}