import { gainStatusEffect } from '../../gainStatusEffect.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const bountyChest = {
    options: {
      type: 'bounty'
    },
    contents: {
      gold: actionDef.value * subject.level
    }
  }
  return gainStatusEffect(combat, actor, subject, abilityInstance, {
    rewards: {
      chests: bountyChest
    }
  })
}